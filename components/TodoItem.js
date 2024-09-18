import Checkbox from 'expo-checkbox';
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginRight: 10,
  },
  todoItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  editButton: {
    backgroundColor: '#4682B4',
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
});

export default function TodoItem({ task, deleteTask, toggleCompleted, editTask, toggleStarred }) {
  const [isEditing, setIsEditing] = useState(false); 
  const [newText, setNewText] = useState(task.text);
  const [showDetails, setShowDetails] = useState(false); 
  const inputRef = useRef(null); 

  function handleSave() {
    if (newText.trim() !== '') {
      editTask(task.id, newText); 
      setIsEditing(false); 
    } else {
      setIsEditing(false); 
    }
  }

  React.useEffect(() => {
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
      </View>

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

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteTask(task.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>

      {showDetails && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>
            Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleString() : 'None'}
          </Text>
          <Text style={styles.detailText}>Priority: {task.priority}</Text>
        </View>
      )}
    </View>
  );
}
