import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';

const UpgradeModal = ({ visible, onClose }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Upgrade to Pro</Text>
          <Text style={styles.modalText}>
            Empower your team with these additional features:
          </Text>
          <View style={styles.featureList}>
            <Text>✅ Manage your work in private boards</Text>
            <Text>✅ Store an unlimited number of files</Text>
            <Text>✅ Easily log in with your Google account</Text>
            <Text>✅ Customize your team's directory</Text>
          </View>
          <Text style={styles.priceText}>
            For only $90 more a year, you can get the most popular plan.
          </Text>
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>Confirm upgrade</Text>
          </TouchableOpacity>
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  featureList: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  upgradeButton: {
    backgroundColor: '#64049a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default UpgradeModal;
