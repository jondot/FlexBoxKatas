
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

export default (props)=>(
  <View key={props.number} style={styles.box}>
    <Text>{props.number}</Text>
  </View>
)

const styles = StyleSheet.create(
  {
    box:{
      width:40,
      height:40,
      backgroundColor:'red',
      margin:1,
      padding:5,
    },
  }
)
