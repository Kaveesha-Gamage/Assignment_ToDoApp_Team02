import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../App'; // Import useTheme from App.js

const SettingsScreen = ({ navigation }) => {
  const { theme } = useTheme(); // Access the theme

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => navigation.goBack()} // Navigate back to the previous screen
        >
          <MaterialIcons name="chevron-left" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* Menu Options */}
      <TouchableOpacity style={styles.menuItem}>
        <MaterialIcons name="language" size={24} color="#4A90E2" />
        <Text style={[styles.menuText, { color: theme.colors.text }]}>Language</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <FontAwesome name="google" size={24} color="#4A90E2" />
        <Text style={[styles.menuText, { color: theme.colors.text }]}>Help Us Translate</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <MaterialIcons name="star-rate" size={24} color="#4A90E2" />
        <Text style={[styles.menuText, { color: theme.colors.text }]}>Rate Us</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <MaterialIcons name="share" size={24} color="#4A90E2" />
        <Text style={[styles.menuText, { color: theme.colors.text }]}>Share App</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <MaterialIcons name="feedback" size={24} color="#4A90E2" />
        <Text style={[styles.menuText, { color: theme.colors.text }]}>Feedback</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <MaterialIcons name="security" size={24} color="#4A90E2" />
        <Text style={[styles.menuText, { color: theme.colors.text }]}>Privacy Policy</Text>
      </TouchableOpacity>

      {/* Version Information */}
      <View style={styles.versionContainer}>
        <Text style={[styles.versionText, { color: theme.colors.text }]}>Version: 1.02.54.0809</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: "#F0F4FF",
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 40,
  },
  arrowButton: {
    paddingLeft: 0,
    paddingRight: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  menuText: {
    paddingLeft: 15,
    fontSize: 16,
  },
  versionContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default SettingsScreen;
