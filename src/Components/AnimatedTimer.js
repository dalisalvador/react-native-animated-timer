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
  debug,
  eq,
  add,
  greaterThan
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
    pause,
    showMilli,
    colors
  } = props;

  const runTiming = (clock, value, dest) => {
    const config = {
      duration: time,
      toValue: new Value(0),
      easing: Easing.linear
    };

    const state = {
      paused: new Value(0),
      started: new Value(0),
      finished: new Value(0),
      position: new Value(0),
      time: new Value(0),
      frameTime: new Value(0),
      timeSyncedWithClock: new Value(0)
    };

    return block([
      cond(
        clockRunning(clock),
        [
          cond(
            pauseFlag,
            [set(state.paused, 1), set(state.time, clock)],
            [set(state.paused, 0), set(config.toValue, dest)]
          )
        ],
        [cond(not(state.started), [set(state.started, 1), startClock(clock)])]
      ),
      cond(not(state.paused), [
        call([state.frameTime], value => {
          if (showMilli) {
            setShowedTime(
              Number.parseFloat(value[0] / 1000).toFixed(showMilli)
            );
          } else setShowedTime(Math.floor(value[0] / 1000));
        }),
        timing(clock, state, config)
      ]),
      cond(state.finished, [
        call([], () => {
          setShowedTime(0);
        }),
        cond(
          loop,
          [
            stopClock(clock),
            call([], () => {
              if (colors !== undefined) {
                if (colors.length === 1) {
                  setLastBackground(backgroundRef.current);
                  setBackground(randomColor());
                } else if (
                  colors.length !==
                  colors.indexOf(backgroundRef.current) + 1
                ) {
                  setLastBackground(backgroundRef.current);
                  setBackground(
                    colors[colors.indexOf(lastBackgroundRef.current) + 1]
                  );
                } else {
                  setLastBackground(backgroundRef.current);
                  setBackground(colors[0]);
                }
              } else {
                setLastBackground(backgroundRef.current);
                setBackground(randomColor());
              }
              if (onTimeFinished) onTimeFinished();
            }),
            set(state.finished, 0),
            set(state.time, 0),
            set(state.position, value),
            set(state.frameTime, 0),
            set(config.toValue, dest),
            startClock(clock)
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

  const [showedTime, setShowedTime] = useState(0);

  useEffect(() => {
    if (colors !== undefined) {
      if (colors.length === 1) {
        setLastBackground(colors[0]);
        setBackground(randomColor());
      } else if (colors.length > 1) {
        setLastBackground(colors[0]);
        setBackground(colors[1]);
      } else if (colors.length === 0) {
        setLastBackground(randomColor());
        setBackground(randomColor());
      }
    } else {
      setLastBackground(randomColor());
      setBackground(randomColor());
    }
    progress.current = runTiming(clock, 0, 100);
  }, []);

  useEffect(() => {
    if (pause) pauseFlag.setValue(1);
    else pauseFlag.setValue(0);
  }, [pause]);

  const randomColor = () => {
    return (
      "#" +
      Math.random()
        .toString(16)
        .slice(2, 8)
    );
  };
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
            {showedTime}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default AnimatedTimer;
