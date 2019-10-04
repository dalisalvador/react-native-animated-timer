import React, { Fragment, useState, useEffect, useRef } from "react";
import { View, Text, YellowBox } from "react-native";
import Animated, { Easing } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

// //TODO:CHECK NOT USING THIS LIFECYCLE METHODS. Ignoring change of lifecycle react-native
YellowBox.ignoreWarnings([
  "Warning: componentWillMount is deprecated",
  "Warning: componentWillReceiveProps is deprecated",
  "Warning: componentWillUpdate is deprecated",
  "Sending `onReanimatedPropsChange` with no listeners registered."
]);

const {
  Clock,
  Value,
  set,
  cond,
  startClock,
  clockRunning,
  timing,
  stopClock,
  block,
  onChange,
  call,
  not,
  and,
  divide,
  multiply,
  sub,
  debug
} = Animated;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const clock = new Clock();
const pauseFlag = new Value(0);

const AnimatedTimer = ({ ...props }) => {
  const {
    radius,
    time,
    colorA,
    colorB,
    randomColors,
    style,
    textStyle,
    showTime,
    onTimeFinished,
    loop = true,
    pause
  } = props;

  const runTiming = (clock, value, dest) => {
    const config = {
      duration: time,
      toValue: new Value(0),
      easing: Easing.inOut(Easing.ease)
    };

    const state = {
      paused: new Value(0),
      started: new Value(0),
      finished: new Value(0),
      position: new Value(0),
      time: new Value(0),
      frameTime: new Value(0)
    };

    const pausedState = {
      position: new Value(0),
      time: new Value(0),
      frameTime: new Value(0)
    };

    return block([
      cond(and(pauseFlag, not(state.paused)), [
        set(state.paused, 1),
        set(pausedState.position, state.position),
        set(pausedState.time, state.time),
        set(pausedState.frameTime, state.frameTime),
        stopClock(clock),
        debug("State time:", state.time),
        debug("State position:", state.position),
        debug("State frameTime:", state.frameTime),
        debug("pausedState time:", pausedState.time),
        debug("pausedState position:", pausedState.position),
        debug("pausedState frameTime:", pausedState.frameTime)
      ]),
      cond(and(not(pauseFlag), state.paused), [
        set(state.paused, 0),
        set(state.position, pausedState.position),
        set(state.time, pausedState.time),
        set(state.frameTime, pausedState.frameTime),
        debug("State time:", state.time),
        debug("State position:", state.position),
        debug("State frameTime:", state.frameTime),
        debug("pausedState time:", pausedState.time),
        debug("pausedState position:", pausedState.position),
        debug("pausedState frameTime:", pausedState.frameTime),
        startClock(clock)
      ]),
      cond(
        clockRunning(clock),
        [set(config.toValue, dest)],
        [cond(not(state.started), [startClock(clock), set(state.started, 1)])]
      ),
      cond(not(state.paused), [timing(clock, state, config)]),
      // debug('State time:', state.time),
      // debug('State position:', state.position),
      // debug('State frameTime:', state.frameTime),
      // debug('pausedState time:', pausedState.time),
      // debug('pausedState position:', pausedState.position),
      // debug('pausedState frameTime:', pausedState.frameTime),
      cond(state.finished, [
        cond(
          loop,
          [
            stopClock(clock),
            call([], () => {
              if (
                !randomColors &&
                colorA !== undefined &&
                colorB !== undefined
              ) {
                if (lastBackgroundRef.current === colorB) {
                  setLastBackground(colorA);
                  setBackground(colorB);
                } else {
                  setLastBackground(colorB);
                  setBackground(colorA);
                }
              } else {
                setLastBackground(backgroundRef.current);
                setBackground(
                  "#" +
                    Math.random()
                      .toString(16)
                      .slice(2, 8)
                );
              }
              if (onTimeFinished) onTimeFinished();
            }),
            set(state.finished, 0),
            set(state.time, 0),
            set(state.position, value),
            set(state.frameTime, 0),
            set(config.toValue, dest)
          ],
          [
            cond(clockRunning(clock), [
              call([], () => {
                if (onTimeFinished) onTimeFinished();
              })
            ]),
            stopClock(clock)
          ]
        )
      ]),
      state.position
    ]);
  };

  const progress = useRef();

  //Animation Backgrounds
  const [lastBackground, setLastBackground] = useState();
  const [background, setBackground] = useState();

  const backgroundRef = useRef(background);
  backgroundRef.current = background;
  const lastBackgroundRef = useRef(lastBackground);
  lastBackgroundRef.current = lastBackground;

  const normalizedRadius = radius - radius * 0.4 * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset = sub(
    circumference,
    multiply(divide(progress.current, 100), circumference)
  );

  const [roundTime, setRoundTime] = useState(time / 1000);
  const roundTimeRef = useRef(roundTime);
  roundTimeRef.current = roundTime;

  const tick = currentTime => {
    if (currentTime === 0) {
      setRoundTime(time / 1000);
    } else setRoundTime(currentTime - 1);
  };

  useEffect(() => {
    if (!randomColors && colorA !== undefined && colorB !== undefined) {
      setLastBackground(colorA);
      setBackground(colorB);
    } else {
      setLastBackground("red");
      setBackground("blue");
    }
    progress.current = runTiming(clock, 0, 100);
    setInterval(() => tick(roundTimeRef.current), 1000);
  }, []);

  useEffect(() => {
    if (pause) pauseFlag.setValue(1);
    else pauseFlag.setValue(0);
  }, [pause]);

  return (
    <View
      elevation={5}
      style={{
        height: radius * 0.8,
        width: radius * 0.8,
        borderRadius: radius * 0.8 * 4,
        backgroundColor: "transparent",
        shadowOpacity: 1,
        shadowOffset: {
          width: 0,
          height: 5
        },
        shadowColor: "#000000",
        shadowRadius: 3
      }}
    >
      <Svg height="100%" width="100%">
        <AnimatedCircle
          fill={lastBackground}
          r={normalizedRadius * 2}
          cx={(radius * 0.8) / 2}
          cy={(radius * 0.8) / 2}
        />

        <AnimatedCircle
          stroke={background}
          fill={"transparent"}
          strokeWidth={radius * 0.4}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          strokeWidth={radius * 0.4}
          r={normalizedRadius}
          cx={(radius * 0.8) / 2}
          cy={(radius * 0.8) / 2}
        />
      </Svg>
      {showTime ? (
        <View
          style={{
            position: "absolute",
            backgroundColor: "transparent",
            height: "100%",
            width: "100%",
            justifyContent: "center"
          }}
        >
          <Text
            style={[
              {
                color: "white",
                textAlign: "center",
                fontSize: radius * 0.4
              },
              textStyle
            ]}
          >
            {roundTime}
          </Text>
        </View>
      ) : null}
      {/* <Animated.Code>
        {() =>
          onChange(pauseFlag, [
            cond(pauseFlag, [startClock(clock)], [stopClock(clock)]),
          ])
        }
      </Animated.Code> */}
    </View>
  );
};

export default AnimatedTimer;
