import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native'
import Animated from 'react-native-reanimated'
import Svg, {Path} from "react-native-svg"
import { interpolatePath } from "d3-interpolate-path";
import {deviceWidth} from "./styleHelper"

const {
  Value, event, call, block,
} = Animated;

const terrible = `M0,0,L0,80A5900,5900,0,0,0,${deviceWidth},80,L${deviceWidth},0,Z`;
const great = `M0,0,L0,70A600,600,0,0,0,${deviceWidth},70,L${deviceWidth},0,Z`;
const interpolator = interpolatePath(terrible, great);

class SVGHeader extends Component {
  y = new Value(0)

  onScroll = event(
      [
        {
          nativeEvent: {
            contentOffset: {y: this.y},
          },
        },
      ]
  )

  path = React.createRef()

  interpolatePath = ([progress]: [number]) => {
    const d = interpolator(progress);
    console.log('interpolatePath', {d, progress})
    if (this.path.current) {
      this.path.current.setNativeProps({d});
    }
  };

  render() {
    const progress = this.y.interpolate({
      inputRange: [0, 600],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    })
    return (
        <View style={{flex:1}}>
          <Animated.View
              style={{
                height: 60, backgroundColor: 'green',
                opacity: progress
              }}
          >
          </Animated.View>
          <Svg
              style={{marginLeft: -StyleSheet.hairlineWidth, backgroundColor:'grey'}}
              viewBox={`0 0 ${deviceWidth} 120`}
              width={deviceWidth + StyleSheet.hairlineWidth + StyleSheet.hairlineWidth}
              height={120}
          >
            <Animated.Code>
              {
                () => block([
                  call([progress], this.interpolatePath),
                ])
              }
            </Animated.Code>
            <Path
                ref={this.path}
                d={great}
                fill={'blue'}
                stroke={"none"}
            />
          </Svg>
          <Animated.ScrollView
              style={[StyleSheet.absoluteFill, {zIndex: -5}]}
              showsVerticalScrollIndicator={true}
              scrollEventThrottle={1}
              bounces={false}
              contentContainerStyle={{height: 1600}}
              onScroll={this.onScroll}
          />
        </View>
    );
  }
}

SVGHeader.propTypes = {};

export default SVGHeader;
