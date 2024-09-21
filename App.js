import React, { useState, createContext, useContext } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorScheme, StyleSheet, View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import TodoList from './components/TodoList'; 
import CustomDrawerContent from './components/CustomDrawer';
import SettingScreen from './components/SettingScreen';
import FeedbackScreen from './components/FeedbackScreen';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import { MaterialIcons } from '@expo/vector-icons';

// Theme Context to share theme information
const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function DrawerNavigator({ user }) {
  const { theme } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerTitle: "Home",
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        drawerStyle: { 
          width: 240,
          backgroundColor: theme.colors.background,
        },
        drawerInactiveTintColor: theme.colors.text,
        drawerActiveTintColor: '#fff',
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
            <Text style={{ color: theme.colors.text, marginRight: 10 }}>{user?.username}</Text>
            <MaterialIcons name="account-circle" size={30} color={theme.colors.text} />
          </View>
        ),
      }}
    >
      <Drawer.Screen name="Home">
        {(props) => <TodoList {...props} theme={theme} />}
      </Drawer.Screen>
      <Drawer.Screen name="Settings" component={SettingScreen} />
      <Drawer.Screen name="Feedback" component={FeedbackScreen} />
    </Drawer.Navigator>
  );
}

function AppNavigator({ user }) {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen 
        name="Splash" 
        component={SplashScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Login" 
        options={{ headerShown: false }} 
      >
        {(props) => <LoginScreen {...props} setUser={user.setUser} />}
      </Stack.Screen>
      <Stack.Screen 
        name="Main" 
        options={{ headerShown: false }}
      >
        {(props) => <DrawerNavigator {...props} user={user} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function App() {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState(systemScheme === 'dark' ? DarkTheme : DefaultTheme);
  const [user, setUser] = useState(null);  // Store user info after login

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme.dark ? DefaultTheme : DarkTheme
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <NavigationContainer theme={theme}>
        <AppNavigator user={{ username: user?.username, setUser }} />
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}
