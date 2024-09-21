import React, { createContext, useState, useContext } from 'react';
import { useColorScheme } from 'react-native'; // Hook to detect system theme

export const ThemeContext = createContext();

const lightTheme = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    text: '#000000',
    primary: '#6200EE',
  },
};

const darkTheme = {
  dark: true,
  colors: {
    background: '#000000',
    text: '#FFFFFF',
    primary: '#BB86FC',
  },
};

export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme(); // Detect system-wide theme
  const [theme, setTheme] = useState(systemTheme === 'dark' ? darkTheme : lightTheme); 

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme.dark ? lightTheme : darkTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
