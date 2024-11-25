import React from 'react'
import { View, Image, Text, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { primary, white } from '../../utils/colors';


export default function Header({ leftNode, centerNode, rightNode, style }) {
  const onLayout = (event) => {
    const { x, y, height, width } = event.nativeEvent.layout;
    // height=200
  }
  return (
    <View
      onLayout={onLayout}
      style={{
        paddingBottom: 20,
        // minHeight: Dimensions.get('screen').height / 7.5,
        // maxHeight: Dimensions.get('screen').height / 4.5,
        // flex: 1,
        // flexWrap:'wrap',
        height: Dimensions.get('screen').height / 8.5,
        backgroundColor: primary,
        width: Dimensions.get('screen').width,
        borderColor: '#aaa',
        borderBottomWidth: 1,
        // backgroundColor:'red',
        display: "flex",
        flexDirection: "row",
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        position: 'static',
        top: 0,
        left: 0,
        zIndex: 100,
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: 14,
        ...style
      }}>
      {leftNode ? leftNode : null}
      {centerNode ? centerNode : null}
      {rightNode ? rightNode : null}
    </View>
  )
}