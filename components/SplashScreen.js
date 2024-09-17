import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const SplashScreen = () => {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current; 
  const opacityAnim = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    // Image animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Title animation
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    });

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 6000);

    return () => clearTimeout(timer);
  }, [navigation, scaleAnim, opacityAnim]);

  return (
    <LinearGradient
      colors={['#6A5ACD', '#8A2BE2', '#DA70D6']}
      style={styles.container}
    >
      <Animated.Image
        source={require('../assets/to-do-list.png')}
        style={[styles.image, { transform: [{ scale: scaleAnim }] }]}
      />
      <Animated.View style={{ opacity: opacityAnim }}>
        <Text style={styles.title}>To-Do List</Text>
        <Text style={styles.subtitle}>Task It. Track It. Complete It!</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 10,
    fontStyle: 'italic',
  },
});

export default SplashScreen;
