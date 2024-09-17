import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../App'; // Import useTheme from App.js
import UpgradeModal from './UpgradeModal'; // Import the UpgradeModal component

const CustomDrawerContent = (props) => {
  const { theme, toggleTheme } = useTheme(); // Access the theme and toggleTheme from the context
  const [modalVisible, setModalVisible] = useState(false); 

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <DrawerContentScrollView {...props} style={[styles.drawerContainer, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
        
          style={styles.arrowButton}
          onPress={() => props.navigation.navigate('Home')}  // Navigate to Home screen
        >
          <MaterialIcons name="chevron-left" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Options</Text>
      </View>

      {/* Menu Options */}
      <TouchableOpacity style={styles.menuItem} onPress={toggleModal}>
        <MaterialCommunityIcons name="crown" size={24} color="#AA336A" style={styles.icon} />
        <Text style={[styles.menuText, { color: theme.colors.text }]}>Upgrade to PRO</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <MaterialCommunityIcons name="star" size={24} color="#AA336A" style={styles.icon} />
        <Text style={[styles.menuText, { color: theme.colors.text }]}>Star Tasks</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <MaterialIcons name="category" size={24} color="#AA336A" style={styles.icon} />
        <Text style={[styles.menuText, { color: theme.colors.text }]}>Category</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={toggleTheme}>
        <MaterialIcons name="brightness-6" size={24} color="#AA336A" style={styles.icon} />
        <Text style={[styles.menuText, { color: theme.colors.text }]}>Theme</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <MaterialCommunityIcons name="widgets" size={24} color="#AA336A" style={styles.icon} />
        <Text style={[styles.menuText, { color: theme.colors.text }]}>Widget</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('Feedback')}>
        <MaterialIcons name="feedback" size={24} color="#AA336A" style={styles.icon} />
        <Text style={[styles.menuText, { color: theme.colors.text }]}>Feedback</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <MaterialCommunityIcons name="information" size= {24} color="#AA336A" style={styles.icon} />
        <Text style={[styles.menuText, { color: theme.colors.text }]}>FAQ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('Settings')}>
        <MaterialIcons name="settings" size={24} color="#AA336A" style={styles.icon} />
        <Text style={[styles.menuText, { color: theme.colors.text }]}>Settings</Text>
      </TouchableOpacity>

      {/* Add UpgradeModal at the bottom */}
      <UpgradeModal visible={modalVisible} onClose={toggleModal} />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row', 
    padding: 20,
    backgroundColor: "#CCCCFF",
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
});

export default CustomDrawerContent;
