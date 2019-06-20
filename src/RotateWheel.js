import React, {Component} from 'react';
import {Animated, Easing, Image, StyleSheet, TouchableOpacity, View} from "react-native"
import {deviceWidth} from "./styleHelper"

class RotateWheel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prizeSections: 8,
      rotating: false,
      destination: -1,
    };
    this.rotateDeg = new Animated.Value(0)
    this.rotateDeg.addListener(this.rotateListener)
  }

  rotateListener = (value) => {
    console.log('rotateDeg changing', value)
  }

  rotateImgDelegate = () => {
    if (!this.state.rotating) {
      this.rotateDeg = new Animated.Value(0)
      this.setState({
        rotating: !this.state.rotating,
      }, () => {
        this.rotateImg();
      });
    } else {
      this.rotateToIndex(7)
    }
  };

  rotateImg = () => {
    Animated.timing(this.rotateDeg, {
      toValue: 1000,
      duration: 15000,
      easing: Easing.linear,
      useNativeDriver: true
    }).start(() => {
      console.log('end callback')
    })
  };

  rotateToIndex = (destination) => {
    let oneTimeRotate = (destination * 100 / 8) + 6.25;
    console.log("oneTimeRotate", {oneTimeRotate})
    this.rotateDeg.stopAnimation((rotateValue) => {
      console.log("oneTimeRotate", {rotateValue})
      let rotateAll = Math.ceil(rotateValue / 100) * 100 + oneTimeRotate
      let rotateTime = 20 * (rotateAll - rotateValue)
      console.log("oneTimeRotate", {rotateAll})
      Animated.timing(this.rotateDeg, {
        toValue: rotateAll,
        duration: rotateTime,
        easing: Easing.out(Easing.ease),
      }).start(() => {
        this.setState({
          rotating: false,
          destination: -1,
        })
      })
    })
  }

  render() {
    return (
        <View style={styles.container}>
          <Animated.View style={{
            transform: [
              {
                rotate: this.rotateDeg.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0deg', '360deg']
                })
              }]
          }}>
            <Image
                source={require('./Images/rotateWheel.png')}
                style={[styles.mainImg,]}>
            </Image>
          </Animated.View>
          <TouchableOpacity onPress={this.rotateImgDelegate} style={styles.centerPoint}>
            <Image source={require('./Images/rotatePointer.png')} style={styles.imgPoint}/>
          </TouchableOpacity>

        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgPoint: {
    width: 93,
    height: 104,
  },
  centerPoint: {
    position: 'absolute',
    left: (deviceWidth-60-93)/2,
    top: (deviceWidth-60-115)/2,
  },
  mainImg: {
    width: deviceWidth-60,
    height: deviceWidth-60,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
    position: 'relative'
  }
});

RotateWheel.propTypes = {};

export default RotateWheel;




