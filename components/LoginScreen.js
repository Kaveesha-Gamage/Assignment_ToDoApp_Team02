// components/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, ImageBackground, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const LoginScreen = ({ navigation, setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username && password) {
      // Save user info
      setUser({ username });
      // Navigate to Main Screen after login
      navigation.replace('Main');
    } else {
      alert('Please enter both username and password');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/background.png')} // Add your background image here
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.tagline}>Stay on top of your tasks effortlessly</Text>

        <TextInput 
          style={styles.input} 
          placeholder="Username" 
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#999"
        />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Don't have an account?{' '}
          <Text style={styles.link} onPress={() => alert('Sign up flow')}>
            Sign Up
          </Text>
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: width, // Full width of the screen
    height: height, // Full height of the screen
    justifyContent: 'center',
    resizeMode: 'cover', // Cover the whole screen
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white overlay
  },
  title: {
    fontSize: 28,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  tagline: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 25, // Rounded corners for inputs
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6a1b9a', // Custom button color
    paddingVertical: 15,
    borderRadius: 25, // Rounded corners for button
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  footer: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
  link: {
    color: '#6a1b9a',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
