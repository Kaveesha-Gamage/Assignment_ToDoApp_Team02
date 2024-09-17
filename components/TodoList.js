import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TodoItem from './TodoItem';
import { useTheme } from '../App'; // Import useTheme from App.js

export default function TodoList() {
  const { theme } = useTheme(); // Access the theme from the context
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Doctor Appointment', completed: true },
    { id: 2, text: 'Meeting at School', completed: false },
  ]);
  const [text, setText] = useState('');

  // Function to Add Task
  function addTask() {
    const newTask = { id: Date.now(), text, completed: false };
    setTasks([...tasks, newTask]);
    setText('');
  }

  // Function to Delete Task
  function deleteTask(id) {
    setTasks(tasks.filter(task => task.id !== id));
  }

  // Function to Toggle Task Completion
  function toggleCompleted(id) {
    setTasks(tasks.map(task => (task.id === id ? { ...task, completed: !task.completed } : task)));
  }

  // Render TodoList Component
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {tasks.map(task => (
        <TodoItem
          key={task.id}
          task={task}
          deleteTask={deleteTask}
          toggleCompleted={toggleCompleted}
          theme={theme} // Pass theme to TodoItem
        />
      ))}
      <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <TextInput
          style={[styles.textInput, { color: theme.colors.text }]}
          value={text}
          onChangeText={setText}
          placeholder="New Task"
          placeholderTextColor={theme.colors.placeholder}
        />
        <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.colors.primary }]} onPress={addTask}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
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
  },
  addButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
