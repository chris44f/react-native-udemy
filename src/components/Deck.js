import React, {useState, useEffect, useRef} from 'react';
import {Animated, PanResponder, Dimensions} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.5;
const SWIPE_OUT_DURATION = 250;

export const Deck = ({
  data,
  renderData,
  onSwipeLeft = () => {},
  onSwipeRight = () => {},
}) => {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [bob, setBob] = useState(0);

  const resetPosition = () => {
    // spring = bouncy feeling
    Animated.spring(position, {
      toValue: {x: 0, y: 0},
    }).start();
  };

  const forceSwipe = (direction) => {
    // timing is like spring, but not bouncy
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(position, {
      // Move it to out of screen view
      toValue: {x, y: 0},
      duration: SWIPE_OUT_DURATION,
      // Pass in a callback function into the start() for something that happens after the animation is finished
    }).start(() => onSwipeComplete(direction).bind(this));
  };

  const onSwipeComplete = (direction) => {
    console.log('current', currentIndex);
    console.log('bob', bob);
    const item = data[currentIndex];
    direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
    position.setValue({x: 0, y: 0});
    const newIndex = currentIndex + 1;
    console.log('new', newIndex);
    setBob(5);
    setCurrentIndex(newIndex);
  };

  const position = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      // Executed when user presses down on screen. If true, panresponder is responsible for moving
      onStartShouldSetPanResponder: () => true,
      // Callback when user is pressing and dragging around screen
      onPanResponderMove: (event, gesture) =>
        position.setValue({x: gesture.dx, y: gesture.dy}),
      // Callback when user removes finger from screen
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      },
    }),
  ).current;

  const rotate = position.x.interpolate({
    // This is effectively comparing two scales
    // i.e. -500units compares to -120deg
    // Hardcoding these values isn't good practice due to various devices
    // Adding in multipliers can help with making sure it doesnt happen too much/too quickly
    inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
    outputRange: ['-120deg', '0deg', '120deg'],
  });

  const getCardStyle = () => {
    return {
      ...position.getLayout(),
      transform: [{rotate}],
    };
  };

  const renderCards = () =>
    data.map((card, index) => {
      // First card of the deck has animation
      if (index < currentIndex) {
        return null;
      }
      if (index === currentIndex) {
        return (
          <Animated.View
            // refactor out the styling as it can be messy
            style={getCardStyle()}
            {...panResponder.panHandlers}
            key={card.id}>
            {renderData(card)}
          </Animated.View>
        );
      }
      return renderData(card);
    });

  return <>{renderCards()}</>;
};
