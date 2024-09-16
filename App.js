import React, { useState, createContext, useContext } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorScheme, StyleSheet, View, Text, Button } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import TodoList from './components/TodoList'; // Assuming you have this
import CustomDrawerContent from './components/CustomDrawer'; // Assuming you have this
import SettingScreen from './components/SettingScreen';
import FeedbackScreen from './components/FeedbackScreen';
import SplashScreen from './components/SplashScreen';

// Theme Context to share theme information
const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen 
        name="Splash" 
        component={SplashScreen} 
        options={{ headerShown: false }} // Hides the header for splash screen
      />
      <Stack.Screen 
        name="Main" 
        component={DrawerNavigator} 
        options={{ headerShown: false }} // Hides the header for main content
      />
    </Stack.Navigator>
  );
}

function DrawerNavigator() {
  const { theme } = useTheme(); // Access theme from context

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true, // Make sure header is visible with menu icon
        headerTitle: "Home", // Set header title
        headerStyle: {
          backgroundColor: theme.colors.background, // Change background color for header
        },
        headerTintColor: theme.colors.text, // Adjust header text color
        drawerStyle: { 
          width: 240,
          backgroundColor: theme.colors.background, // Change drawer background according to theme
        },
        drawerInactiveTintColor: theme.colors.text, // Adjust text color for menu items
        drawerActiveTintColor: '#fff', // Keep the active item highlighted
      }}
    >
      {/* Add Home, Settings, and Feedback options */}
      <Drawer.Screen name="Home" component={TodoList} />
      <Drawer.Screen name="Settings" component={SettingScreen} />
      <Drawer.Screen name="Feedback" component={FeedbackScreen} />

      {/* Add additional options as per the image, including doctor appointments */}
      <Drawer.Screen name="Doctor Appointment" component={TodoList} options={{ drawerLabel: "Doctor Appointment" }} />
      <Drawer.Screen name="Meeting at School" component={TodoList} options={{ drawerLabel: "Meeting at School" }} />
    </Drawer.Navigator>
  );
}

export default function App() {
  const systemScheme = useColorScheme(); // Detects system theme (light/dark)
  const [theme, setTheme] = useState(systemScheme === 'dark' ? DarkTheme : DefaultTheme);

  // Toggle between Light and Dark themes
  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme.dark ? DefaultTheme : DarkTheme
    ); // Toggle between themes
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <NavigationContainer theme={theme}>
        <AppNavigator />
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  themeToggleContainer: {
    position: 'absolute',
    bottom: 50, // Adjust the button position
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: 350,
    padding: 25,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
  },
});
