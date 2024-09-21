import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation, setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username && password) {
      setUser({ username });
      navigation.replace('Main');
    } else {
      alert('Please enter both username and password');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.background}
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.tagline}>Stay on top of your tasks effortlessly</Text>

        <TextInput 
          style={styles.input} 
          placeholder="Username" 
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#888"
        />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#888"
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
    width: width,
    height: height,
    justifyContent: 'center',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30, 
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tagline: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 30,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 18,
    width: '65%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  button: {
    backgroundColor: '#6a1b9a', 
    paddingVertical: 15,
    borderRadius: 30,
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  footer: {
    fontSize: 15,
    textAlign: 'center',
    color: '#444',
    marginTop: 20,
  },
  link: {
    color: '#6a1b9a',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
