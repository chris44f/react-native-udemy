import React, {Component} from 'react';
import {Animated, PanResponder, Dimensions} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.5;
const SWIPE_OUT_DURATION = 250;

export class DeckClass extends Component {
  static defaultProps = {
    onSwipeRight: () => {},
    onSwipeLeft: () => {},
  };

  constructor(props) {
    super(props);

    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) =>
        position.setValue({x: gesture.dx, y: gesture.dy}),
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          this.forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe('left');
        } else {
          this.resetPosition();
        }
      },
    });
    this.state = {panResponder, position, index: 0};
  }

  resetPosition() {
    Animated.spring(this.state.position, {
      toValue: {x: 0, y: 0},
    }).start();
  }

  forceSwipe(direction) {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(this.state.position, {
      toValue: {x, y: 0},
      duration: SWIPE_OUT_DURATION,
    }).start(() => this.onSwipeComplete(direction));
  }

  onSwipeComplete(direction) {
    const {onSwipeLeft, onSwipeRight, data} = this.props;
    const item = data[this.state.index];
    direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
    this.state.position.setValue({x: 0, y: 0});
    this.setState({index: this.state.index + 1});
  }

  getCardStyle() {
    const {position} = this.state;
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg'],
    });

    return {
      ...position.getLayout(),
      transform: [{rotate}],
    };
  }

  renderCards() {
    return this.props.data.map((card, index) => {
      if (index < this.state.index) {
        return null;
      }
      if (index === this.state.index) {
        return (
          <Animated.View
            style={this.getCardStyle()}
            {...this.state.panResponder.panHandlers}
            key={card.id}>
            {this.props.renderData(card)}
          </Animated.View>
        );
      }
      return this.props.renderData(card);
    });
  }

  render() {
    return this.renderCards();
  }
}
