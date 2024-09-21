import React, { useState, useEffect } from 'react';
import {
  View, TextInput, Text, TouchableOpacity, StyleSheet, Button, FlatList, Platform,
} from 'react-native';
import TodoItem from './TodoItem'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import { Picker } from '@react-native-picker/picker';  
import * as Notifications from 'expo-notifications'; 
import * as Speech from 'expo-speech'; // Import speech module
import { useTheme } from '../App'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import Voice from 'react-native-voice';
import { useWindowDimensions } from 'react-native';  // Hook for responsive design

let DateTimePicker;
if (Platform.OS === 'web') {
  DateTimePicker = require('react-datepicker').default;
  require('react-datepicker/dist/react-datepicker.css');
} else {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}

// Request permissions for notifications
const requestPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission for notifications is required!');
  }
};

const TodoList = () => {
  const { theme } = useTheme(); // Access the theme context
  const { width, height } = useWindowDimensions();  // Get the screen width and height dynamically
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [dueTime, setDueTime] = useState(new Date());
  const [priority, setPriority] = useState('Medium');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [sortOption, setSortOption] = useState('Date');
  const [filteredTasks, setFilteredTasks] = useState([]); 
  const [showStarred, setShowStarred] = useState(false);
  const [isListening, setIsListening] = useState(false); // State to manage speech input

  // Load tasks from AsyncStorage when the app starts
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem('tasks');
        if (savedTasks !== null) {
          setTasks(JSON.parse(savedTasks));  // Load tasks into the state
        }
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    };
    loadTasks();
  }, []);

   // Save tasks to AsyncStorage whenever they are updated
   useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error('Failed to save tasks:', error);
      }
    };

    if (tasks.length > 0) {
      saveTasks();
    }
  }, [tasks]);
   const clearAllTasks = async () => {
    try {
      await AsyncStorage.removeItem('tasks');
      setTasks([]);
    } catch (error) {
      console.error('Failed to clear tasks:', error);
    }
  };

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    requestPermissions();
  }, []);

  // Function to schedule a notification for the task
  const scheduleTaskNotification = (task) => {
    const dueDateTime = new Date(task.dueDate);
    dueDateTime.setHours(new Date(task.dueTime).getHours());
    dueDateTime.setMinutes(new Date(task.dueTime).getMinutes());

    const trigger = dueDateTime.getTime();
 
    if (trigger > Date.now()) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Task Reminder",
          body: `Don't forget to complete your task: ${task.text}`,
          data: { taskId: task.id },
        },
        trigger: {
          seconds: (trigger - Date.now()) / 1000,
        },
      });
    }
  };

  const isValidTask = (task) => {
    // Check if the task is empty or contains only whitespace
    if (!task.trim()) return false;
    
    // Check if the task consists only of numbers, symbols, or a single character
    const regex = /^[^a-zA-Z]+$/;
    if (task.length === 1 || regex.test(task)) return false;
  
    return true;
  };

  const addTask = () => {
    if (!isValidTask(text)) {
      alert('Please enter a valid task! \nTasks cannot be empty. \ncontain only whitespace, or consist solely of numbers, symbols, or single characters.');
      return;
    }

    const now = new Date();
    const selectedDateTime = new Date(dueDate);
    selectedDateTime.setHours(new Date(dueTime).getHours());
    selectedDateTime.setMinutes(new Date(dueTime).getMinutes());

    if (selectedDateTime < now) {
      alert('Please select a future date and time.');
      return;
    }

    const newTask = { 
      id: Date.now(), 
      text, 
      completed: false, 
      dueDate: dueDate.toISOString(), 
      dueTime: dueTime.toISOString(), 
      priority,
      subtasks: [], // Initialize subtasks as an empty array
    };

    setTasks(prevTasks => [...prevTasks, newTask]);
    scheduleTaskNotification(newTask); // Schedule notification
    resetInputs();
  };

  const resetInputs = () => {
    setText('');
    setDueDate(new Date());
    setDueTime(new Date());
    setPriority('Medium');
    setFilteredTasks([]);
  };

  // Add subtask to a specific task
  const addSubtask = (taskId, subtaskText) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, subtasks: [...task.subtasks, { text: subtaskText, completed: false }] } : task
      )
    );
  };

  const toggleSubtask = (taskId, subtaskIndex) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((subtask, index) =>
                index === subtaskIndex ? { ...subtask, completed: !subtask.completed } : subtask
              ),
            }
          : task
      )
    );
  };

  const handleTextChange = (input) => {
    setText(input);
    if (input.length > 0) {
      const suggestions = tasks.filter(task => 
        task.text.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredTasks(suggestions);
    } else {
      setFilteredTasks([]);
    }
  };

  const sortedTasks = tasks
    .filter(task => (showStarred ? task.starred : true))
    .sort((a, b) => {
      if (sortOption === 'Priority') {
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortOption === 'Date') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else {
        return a.completed - b.completed;
      }
    });

  const toggleCompleted = (id) => {
    setTasks(prevTasks => prevTasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const toggleStarred = (id) => {
    setTasks(prevTasks => prevTasks.map(task =>
      task.id === id ? { ...task, starred: !task.starred } : task
    ));
  };

  // Handle voice input to add tasks
  const startListening = async () => {
    if (!isListening) {
      setIsListening(true);
      try {
        await SpeechRecognition.startAsync({
          onResult: (event) => setText(event.transcription),
          onError: (error) => console.error(error),
        });
      } catch (error) {
        console.error('Error with voice recognition: ', error);
      }
    } else {
      await SpeechRecognition.stopAsync();
      setIsListening(false);
    }
  };

  const renderDatePicker = () => (
    showDatePicker && (
      Platform.OS !== 'web' ? (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setDueDate(date);
          }}
        />
      ) : (
        <DateTimePicker
          selected={dueDate}
          onChange={(date) => {
            setShowDatePicker(false);
            setDueDate(date);
          }}
          dateFormat="MMMM d, yyyy"
        />
      )
    )
  );

  const renderTimePicker = () => (
    showTimePicker && (
      Platform.OS !== 'web' ? (
        <DateTimePicker
          value={dueTime}
          mode="time"
          display="default"
          onChange={(event, time) => {
            setShowTimePicker(false);
            if (time) setDueTime(time);
          }}
        />
      ) : (
        <DateTimePicker
          selected={dueTime}
          onChange={(time) => {
            setShowTimePicker(false);
            setDueTime(time);
          }}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="h:mm aa"
        />
      )
    )
  );


  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background}, { paddingVertical: height * 0.01, paddingHorizontal: width * 0.03 }]}>
      <FlatList
        data={sortedTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TodoItem
            task={item}
            deleteTask={() => setTasks(tasks.filter(task => task.id !== item.id))}
            toggleCompleted={toggleCompleted}
            editTask={(id, newText) => setTasks(tasks.map(task => task.id === id ? { ...task, text: newText } : task))}
            toggleStarred={toggleStarred}
			      addSubtask={addSubtask}
            toggleSubtask={toggleSubtask}
          />
        )}
      />

        <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }, ]}>
        <TextInput
          style={[styles.textInput, { color: theme.colors.text }]}
          value={text}
          onChangeText={handleTextChange}
          placeholder="New Task"
          placeholderTextColor={theme.colors.placeholder}
        />

        <View style={styles.iconContainer}>
          <TouchableOpacity 
            onPress={() => {
              setShowTimePicker(false); 
              setShowDatePicker(true); 
            }}
          >
            <Icon name="calendar" size={24} style={[styles.icon, { color: theme.colors.icon }]} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => {
              setShowDatePicker(false); 
              setShowTimePicker(true); 
            }}
          >
            <Icon name="clock" size={24} style={[styles.icon, { color: theme.colors.icon }]} />
          </TouchableOpacity>

         {/* Voice input button */}
         <TouchableOpacity onPress={startListening}>
            <Icon name={isListening ? 'microphone-off' : 'microphone'} size={24} style={[styles.icon, { color: theme.colors.icon }]} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {filteredTasks.length > 0 && (
        <View style={[styles.suggestionList, { backgroundColor: theme.colors.card }]}>
          {filteredTasks.map(task => (
            <TouchableOpacity key={task.id} onPress={() => setText(task.text)}>
              <Text style={[styles.suggestionText, { color: theme.colors.text }]}>{task.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {renderDatePicker()}
      {renderTimePicker()}

      <Text style={[styles.dateText, { color: theme.colors.text }]}>
        {`${dueDate.toLocaleDateString()} ${dueTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
      </Text>

      <View style={[styles.priorityContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[{ marginLeft: 8, color: theme.colors.text }]}>Priority:</Text>
        <Picker
          selectedValue={priority}
          onValueChange={(itemValue) => setPriority(itemValue)}
          style={[styles.priorityPicker, { color: theme.colors.text }]}
        >
          <Picker.Item label="Low" value="Low" />
          <Picker.Item label="Medium" value="Medium" />
          <Picker.Item label="High" value="High" />
        </Picker>
      </View>

      <View style={styles.sortButtonContainer}>
        <TouchableOpacity style={styles.sortButton} onPress={() => setSortOption('Priority')}>
          <Text style={styles.sortButtonText}>Sort by Priority</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sortButton} onPress={() => setSortOption('Date')}>
          <Text style={styles.sortButtonText}>Sort by Date & Time</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sortButton} onPress={() => setSortOption('Completed')}>
          <Text style={styles.sortButtonText}>Sort by Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sortButton} onPress={() => setShowStarred(!showStarred)}>
          <Text style={styles.sortButtonText}>Sort by Starred</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.clearButtonContainer}>
        <TouchableOpacity style={styles.clearButton} onPress={clearAllTasks}>
          <Text style={styles.clearButtonText}>Clear All Tasks</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#3b9773',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft : 8,
    marginRight: 8
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  icon: {
    marginHorizontal: 5,
    color: '#007bff',
  },
  dateText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    zIndex: 0,
  },
  priorityPicker: {
    height: 40,
    width: 150,
    marginLeft: 10,
  },
  suggestionList: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    marginVertical: 10,
  },
  suggestionText: {
    fontSize: 16,
    paddingVertical: 5,
  },
  sortButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  sortButton: {
    backgroundColor: '#AA336A',
    padding: 10,
    paddingLeft: 8,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 3,
  },
  sortButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  clearButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  clearButton: {
    backgroundColor: '#9a1414',
    padding: 10,
    paddingLeft: 8,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 3,
  },
  clearButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default TodoList;
