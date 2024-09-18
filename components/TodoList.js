import React, { useState, useRef } from 'react';
import {
  View, TextInput, Text, TouchableOpacity, StyleSheet, Button, FlatList, Platform, Alert
} from 'react-native';
import TodoItem from './TodoItem'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import { Picker } from '@react-native-picker/picker';  
import { Audio } from 'expo-av';  // Importing Expo Audio API

let DateTimePicker;
if (Platform.OS === 'web') {
  DateTimePicker = require('react-datepicker').default;
  require('react-datepicker/dist/react-datepicker.css');
} else {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}

const TodoList = () => {
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
  const [hasPermission, setHasPermission] = useState(null);
  const [recording, setRecording] = useState(null);
  const [transcribing, setTranscribing] = useState(false);

  const requestMicrophonePermission = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    setHasPermission(status === 'granted');
    if (status !== 'granted') {
      Alert.alert("Permission required", "Please grant permission to use the microphone.");
    }
  };

  const startRecording = async () => {
    if (!hasPermission) {
      Alert.alert("Permission required", "Please grant permission to use the microphone.");
      return;
    }

    try {
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setTranscribing(true);
      console.log('Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording stopped and stored at', uri);
      setRecording(null);
      setTranscribing(false);
      // Handle transcription here, e.g., using a speech-to-text API
      // For demonstration, just set the text to a placeholder
      setText('Transcribed text here');
    } catch (error) {
      console.error('Failed to stop recording:', error);
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
        alert('Please enter a valid task. Tasks cannot be empty, contain only whitespace, or consist solely of numbers, symbols, or single characters.');
        return;
      }
    
    const newTask = { 
      id: Date.now(), 
      text, 
      completed: false, 
      dueDate: dueDate.toISOString(), 
      dueTime: dueTime.toISOString(), 
      priority,
    };

    setTasks(prevTasks => [...prevTasks, newTask]);
    resetInputs();
  };

  const resetInputs = () => {
    setText('');
    setDueDate(new Date());
    setDueTime(new Date());
    setPriority('Medium');
    setFilteredTasks([]);
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
    <View style={styles.container}>
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
          />
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={text}
          onChangeText={handleTextChange}
          placeholder="New Task"
          placeholderTextColor="#999"
        />

        <View style={styles.iconContainer}>
          <TouchableOpacity 
            onPress={() => {
              setShowTimePicker(false); 
              setShowDatePicker(true); 
            }}
          >
            <Icon name="calendar" size={24} style={styles.icon} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => {
              setShowDatePicker(false); 
              setShowTimePicker(true); 
            }}
          >
            <Icon name="clock" size={24} style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity onPress={requestMicrophonePermission}>
            <Icon name="microphone" size={24} style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity onPress={startRecording} disabled={transcribing}>
            <Icon name="record-circle" size={24} style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity onPress={stopRecording} disabled={!recording}>
            <Icon name="stop-circle" size={24} style={styles.icon} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <Button 
        title={showStarred ? "Show All Tasks" : "Show Starred Tasks"} 
        onPress={() => setShowStarred(!showStarred)} 
      />

      {filteredTasks.length > 0 && (
        <View style={styles.suggestionList}>
          {filteredTasks.map(task => (
            <TouchableOpacity key={task.id} onPress={() => setText(task.text)}>
              <Text style={styles.suggestionText}>{task.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {renderDatePicker()}
      {renderTimePicker()}

      <Text style={styles.dateText}>
        {`${dueDate.toLocaleDateString()} ${dueTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
      </Text>

      <View style={styles.priorityContainer}>
        <Text>Priority:</Text>
        <Picker
          selectedValue={priority}
          onValueChange={(itemValue) => setPriority(itemValue)}
          style={styles.priorityPicker}
        >
          <Picker.Item label="Low" value="Low" />
          <Picker.Item label="Medium" value="Medium" />
          <Picker.Item label="High" value="High" />
        </Picker>
      </View>

      <View>
        <Button title="Sort by Priority" onPress={() => setSortOption('Priority')} />
        <Button title="Sort by Date" onPress={() => setSortOption('Date')} />
        <Button title="Sort by Completed" onPress={() => setSortOption('Completed')} />
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
    backgroundColor: '#28a745',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
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
    padding: 10,
    backgroundColor: '#fff',
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
});

export default TodoList;
