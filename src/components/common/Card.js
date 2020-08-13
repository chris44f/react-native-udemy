import React, {useState, useEffect} from 'react';
import {View, Text, Animated, PanResponder, StyleSheet} from 'react-native';
import {Card as CardUI, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';

export const Card = ({text, uri}) => {
  return (
    <View>
      <CardUI title={text} image={{uri: uri}}>
        <Text style={styles.text}>I can customise the card further</Text>
        <Button backgroundColor="#ff00ff" title="View" />
      </CardUI>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    marginBottom: 10,
  },
});
