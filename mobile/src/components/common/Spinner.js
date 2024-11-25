import React from 'react';
import { View, ActivityIndicator } from 'react-native';


const Spinner = ({ size, color, visible }) => {
  return (
    <View style={{ ...styles.spinnerStyle, display: visible ? 'flex' : 'none', }}>
      <ActivityIndicator size={size || 'large'} color={color} />
    </View>
  );
};

const styles = {
  spinnerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 100
  }
};

export { Spinner };
