import Checkbox from 'expo-checkbox';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: 'column',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  todoItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  deleteButton: {
    backgroundColor: '#cc0000',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  editButton: {
    backgroundColor: '#c27ba0',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    padding: 5,
    color: '#333',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  detailsContainer: {
    marginTop: 10,
    paddingHorizontal: 15,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  starButton: {
    marginRight: 10,
  },
  subtaskContainer: {
    marginLeft: 20,
    paddingTop: 5,
  },
  addSubtaskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  addSubtaskInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 5,
    marginRight: 5,
  },
  showDetailsButton: {
    marginTop: 5,
    alignSelf: 'flex-end',
  },
});

export default function TodoItem({ task, deleteTask, toggleCompleted, editTask, toggleStarred, addSubtask, toggleSubtask }) {
  const [isEditing, setIsEditing] = useState(false); 
  const [newText, setNewText] = useState(task.text);
  const [showDetails, setShowDetails] = useState(false);
  const [newSubtaskText, setNewSubtaskText] = useState(''); 
  const inputRef = useRef(null); 

  function handleSave() {
    if (newText.trim() !== '') {
      editTask(task.id, newText); 
      setIsEditing(false); 
    } else {
      setIsEditing(false); 
    }
  }

  function handleAddSubtask() {
    if (newSubtaskText.trim() !== '') {
      addSubtask(task.id, newSubtaskText); 
      setNewSubtaskText('');
    }
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus(); 
    }
  }, [isEditing]);

  return (
    <View style={styles.todoItem}>
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={task.completed}
          onValueChange={() => toggleCompleted(task.id)}
          tintColors={{ true: '#4CAF50', false: '#ccc' }}
        />
        {isEditing ? (
          <TextInput
            ref={inputRef}
            style={styles.textInput}
            value={newText}
            onChangeText={setNewText}
            onSubmitEditing={handleSave}
            returnKeyType="done"
          />
        ) : (
          <Text style={[styles.todoItemText, task.completed && styles.completed]}>
            {task.text}
          </Text>
        )}
        <TouchableOpacity
          style={styles.starButton}
          onPress={() => toggleStarred(task.id)}
        >
          <Icon
            name={task.starred ? "star" : "star-outline"}
            size={24}
            color={task.starred ? "#FFD700" : "#ccc"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          <Text style={styles.editButtonText}>{isEditing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(task.id)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Display Subtasks */}
      <View style={styles.subtaskContainer}>
        <FlatList
          data={task.subtasks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.checkboxContainer}>
              <Checkbox
                value={item.completed}
                onValueChange={() => toggleSubtask(task.id, index)}
              />
              <Text style={[styles.todoItemText, item.completed && styles.completed]}>{item.text}</Text>
            </View>
          )}
        />
      </View>

      {/* Add Subtask */}
      <View style={styles.addSubtaskContainer}>
        <TextInput
          style={styles.addSubtaskInput}
          value={newSubtaskText}
          onChangeText={setNewSubtaskText}
          placeholder="Add Subtask"
        />
        <TouchableOpacity style={styles.editButton} onPress={handleAddSubtask}>
          <Text>Add</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.showDetailsButton}
        onPress={() => setShowDetails(!showDetails)}
      >
        <Icon
          name={showDetails ? "chevron-up" : "chevron-down"}
          size={24}
          color="#666"
        />
      </TouchableOpacity>

      {showDetails && (
        <View style={styles.detailsContainer}> <Text style={styles.detailText}>
      Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'None'}
    </Text>
    <Text style={styles.detailText}>
      Due Time: {task.dueTime ? new Date(task.dueTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'None'}
    </Text>
		
		  
		
         
		 
		 
		 
		 
		 
		 
		 
		 
		  <Text style={styles.detailText}>
      Created At: {task.id ? new Date(task.id).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'long', day: 'numeric', year: 'numeric' }) : 'None'}
      </Text>
		
        <Text style={styles.detailText}>Priority: {task.priority}</Text>
        </View>
		
      )}
    </View>
  );
}
