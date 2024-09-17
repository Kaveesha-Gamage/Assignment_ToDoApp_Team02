import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../App'; // Import useTheme from App.js

const FeedbackScreen = () => {
  const [rating, setRating] = useState(null);
  const [suggestions, setSuggestions] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const navigation = useNavigation();
  const { theme } = useTheme(); 

  const tags = ['Task Management', 'User Interface', 'Task Reminders', 'Performance', 'Customization Options', 'Collaboration Features', 'Notification System', 'Ease of Use', 'Accessibility Features'];

  const handleTagPress = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const submitFeedback = () => {
    console.log({ rating, selectedTags, suggestions });
    alert('Feedback submitted successfully!');
  };

  const getEmojiColor = (index) => {
    switch (index) {
      case 1:
        return '#FF0000';
      case 2:
        return '#FF7F50';
      case 3:
        return '#FFD700';
      case 4:
        return '#90EE90';
      case 5:
        return '#008000';
      default:
        return theme.colors.text;
    }
  };

  const emojis = [
    { icon: 'sentiment-very-dissatisfied', label: 'Very Dissatisfied' },
    { icon: 'sentiment-dissatisfied', label: 'Dissatisfied' },
    { icon: 'sentiment-neutral', label: 'Neutral' },
    { icon: 'sentiment-satisfied', label: 'Satisfied' },
    { icon: 'sentiment-very-satisfied', label: 'Very Satisfied' }
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Back arrow to navigate to home */}
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={30} color={theme.colors.text} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: theme.colors.text }]}>Feedback</Text>

      {/* Emoji Rating Section */}
      <View style={styles.ratingContainer}>
        {emojis.map((emoji, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setRating(index + 1)}
            style={[
              styles.emojiContainer,
              rating === index + 1 && styles.selectedEmojiContainer
            ]}
          >
            <MaterialIcons
              name={emoji.icon}
              size={rating === index + 1 ? 50 : 40}
              color={rating === index + 1 ? getEmojiColor(index + 1) : theme.colors.text}
              style={rating === index + 1 ? styles.selectedEmoji : styles.unselectedEmoji}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Tags Section */}
      <Text style={[styles.subTitle, { color: theme.colors.text }]}>Tell us what can be improved?</Text>
      <View style={styles.tagsContainer}>
        {tags.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[styles.tag, selectedTags.includes(tag) && styles.selectedTag]}
            onPress={() => handleTagPress(tag)}
          >
            <Text style={[styles.tagText, { color: theme.colors.text }]}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Suggestions TextInput */}
      <TextInput
        style={[styles.textInput, { backgroundColor: theme.colors.inputBackground, color: theme.colors.text }]}
        placeholder="Other suggestions..."
        placeholderTextColor={theme.colors.placeholder}
        multiline={true}
        value={suggestions}
        onChangeText={setSuggestions}
      />

      {/* Submit Button */}
      <TouchableOpacity style={[styles.submitButton, { backgroundColor: theme.colors.primary }]} onPress={submitFeedback}>
        <Text style={[styles.submitButtonText, { color: theme.colors.textOnPrimary }]}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 25,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  emojiContainer: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedEmojiContainer: {
    transform: [{ scale: 1.2 }],
  },
  subTitle: {
    marginTop: 25,
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 10,
  },
  tagsContainer: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  tag: {
    backgroundColor: '#CF9FFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    margin: 5,
  },
  selectedTag: {
    backgroundColor: '#AA336A',
  },
  tagText: {
    color: '#333',
  },
  textInput: {
    height: 100,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FeedbackScreen;
