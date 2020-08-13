import React, {Component, useRef, useEffect} from 'react';
import {View, Animated, StyleSheet} from 'react-native';

export const Ball = () => {
  const moveBall = useRef(new Animated.ValueXY(0, 0)).current;
  useEffect(() => {
    Animated.spring(moveBall, {
      toValue: {x: 200, y: 400},
      useNativeDriver: true,
    }).start();
  }, [moveBall]);

  return (
    <Animated.View style={moveBall.getTranslateTransform()}>
      <View style={styles.ball} />
      <View style={styles.ball} />
    </Animated.View>
  );
};

// export class Ball extends Component {
//   componentWillMount() {
//     this.position = new Animated.ValueXY(0, 0);
//     Animated.spring(this.position, {
//       toValue: {x: 200, y: 500},
//       useNativeDriver: true,
//     }).start();
//   }
//   render() {
//     return (
//       <Animated.View style={this.position.getTranslateTransform()}>
//         <View style={styles.ball} />
//       </Animated.View>
//     );
//   }
// }

const styles = StyleSheet.create({
  ball: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 30,
    borderColor: 'black',
  },
});
