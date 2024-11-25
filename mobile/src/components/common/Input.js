import React, { useState, useEffect, useReducer } from 'react';

import { TextInput, StyleSheet, Animated, View, Text, TouchableOpacity } from 'react-native';
import {
  lightGrey,
  darkGrey,
  tooltipColor,
  placeholderColor,
  darkGreen,
  primary,
  white,
} from '../../utils/colors';
import { useController } from 'react-hook-form';
import { Validate } from '../../utils/validator';
import Icon from 'react-native-vector-icons/Feather'


const Input = ({
  autoCapitalize = 'words',
  multiline,
  numberOfLines,
  style,
  keyboardType,
  placeholder,
  control,
  name,
  isPassword,
  rule,
  initialColor,
  finalColor,
  label,
  containerStyle,
  defaultValue,
  compValue,
  onChange,
  isSignup,
  editable,
  forceValue,
  forceSet
}) => {
  const [animatedValue, setAnimatedValue] = useState(new Animated.Value(0));
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [animatedStyle, setAnimatedStyle] = useState({});
  const [passwordShown, setPasswordShown] = useState(false);

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  function onFocus() {
    setAnimatedValue(new Animated.Value(0));
    const interpolatedColor = animatedValue.interpolate({
      inputRange: [0, 60],
      outputRange: [initialColor, finalColor],
    });
    setAnimatedStyle({
      borderColor: interpolatedColor,
      borderWidth: 2,
    });
    setTooltipVisible(true);
    Animated.timing(animatedValue, {
      toValue: 30,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }

  function onBlur() {
    Animated.timing(animatedValue).stop();
    setAnimatedStyle({
      borderColor: initialColor,
      borderWidth: 2,
    });
    setTooltipVisible(false);
  }

  const { field } = useController({
    control,
    name,
    defaultValue,
  });
  return (
    <View style={{ flex: 1, ...containerStyle, position: 'relative' }}>
      {label && (
        <Text
          style={{
            marginBottom: 8,
            marginTop: 8,
            color:
              rule && !Validate(field.value, rule, compValue) && tooltipVisible
                ? tooltipColor
                : tooltipVisible
                  ? primary
                  : lightGrey,
            fontWeight: '600',
            fontSize: 14,
      
          }}>
          {label}
        </Text>
      )}

      {name === 'password' && isSignup && <Text style={{ fontWeight: '700', marginBottom: 10,  color: darkGrey }}>Password should contain at least one capital letter, one lower case letter, one number, and one special character</Text>
      }
      {name === 'newPassword' && <Text style={{ fontWeight: '700', marginBottom: 10,  color: darkGrey }}>Password should contain at least one capital letter, one lower case letter, one number, and one special character</Text>
      }

      <Animated.View
        style={
          field.value && rule && !Validate(field.value, rule, compValue)
            ? { ...styles.TextInput, ...style, borderColor: tooltipColor }
            : { ...styles.TextInput, ...animatedStyle, ...style }
        }>
        <View style={{ flexDirection: 'row', alignItems: 'center' }} keyboardShouldPersistTaps='always'>
          {isPassword ?
            <View style={{ width: '100%', }}>

              <TextInput
                autoCapitalize={isPassword ? 'none' : autoCapitalize}
                placeholderTextColor={placeholderColor}
                keyboardType={keyboardType}
                value={field.value}
                style={{ paddingLeft: 16, width: '100%', fontWeight: '700', height: 48, color: '#000', alignItems: 'flex-start', padding: 12, ...style, }}
                placeholder={placeholder}
                onChangeText={field.onChange}
                onChange={onChange && onChange}
                onFocus={() => onFocus()}
                onBlur={() => onBlur()}
                selectionColor={darkGreen}
                multiline={multiline || false}
                numberOfLines={numberOfLines}
                secureTextEntry={!passwordShown}
                editable={editable === false ? false : true}
              />
              <TouchableOpacity style={{ position: 'absolute', right: 4, top: 6, zIndex: 1000, padding: 8 }} onPress={() => {
                setPasswordShown(!passwordShown)
                // forceUpdate();
              }}>

                <Icon name={passwordShown ? 'eye' : 'eye-off'} style={{ color: primary, fontSize: 14, }} />
              </TouchableOpacity>
            </View>
            :
            <TextInput
              autoCapitalize={autoCapitalize}
              placeholderTextColor={placeholderColor}
              keyboardType={keyboardType}
              value={field.value}
              style={{ paddingLeft: 16, width: '100%', fontWeight: '700', height: 48, color: '#000', alignItems: 'flex-start', padding: 12, ...style, }}
              placeholder={placeholder}
              onChangeText={field.onChange}
              onChange={onChange && onChange}
              onFocus={() => onFocus()}
              onBlur={() => onBlur()}
              selectionColor={darkGreen}
              multiline={multiline || false}
              numberOfLines={numberOfLines}
              secureTextEntry={isPassword}
              editable={editable === false ? false : true}
            />}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  TextInput: {
    backgroundColor: 'white',
    width: '100%',
    height: 60,
    paddingRight: 10,
    borderRadius: 2,
    marginBottom: 12,
    justifyContent: 'center',
    color: darkGrey,
    fontSize: 14,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#aaa',
  },
});


export { Input };
