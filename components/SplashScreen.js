import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Automatically navigate to the Main screen after 5 seconds
    const timer = setTimeout(() => {
      navigation.replace('Main'); // Corrected the screen name to 'Main'
    }, 5000);

    return () => clearTimeout(timer); // Cleanup the timer when the component unmounts
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/to-do-list.png')} style={styles.image} />
      <Text style={styles.title}>To-Do List</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CF9FFF', // Adjusted color
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default SplashScreen;
