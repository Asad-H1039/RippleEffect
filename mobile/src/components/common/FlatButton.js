import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import { placeholderColor, primary, white } from '../../utils/colors';
const FlatButton = ({ label, onPress, style, textColor, isDisabled }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]} disabled={isDisabled}>
      <Text style={{ ...styles.label, color: textColor ? textColor : styles.label.color }}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    height: 60,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    borderWidth: 1,
    borderColor: '#FFF',
    backgroundColor: primary,
    width: '100%',
    borderRadius: 8,
    paddingLeft: 8,
    paddingRight: 8
  },

  label: {
    fontSize: 14,
    color: white,
    fontWeight: '700'
  },
});

export default FlatButton;
