import React, {Fragment, useState, useEffect, useRef} from 'react';
import {View, Text, YellowBox} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import Svg, {Circle, Defs, Pattern, Image, ClipPath} from 'react-native-svg';

// //TODO:CHECK NOT USING THIS LIFECYCLE METHODS. Ignoring change of lifecycle react-native
YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
  'Warning: componentWillUpdate is deprecated',
  'Sending `onReanimatedPropsChange` with no listeners registered.',
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
  greaterThan,
} = Animated;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const clock = new Clock();
const pauseFlag = new Value(0);

const AnimatedTimer = ({...props}) => {
  const {
    radius,
    time,
    textStyle,
    showTime,
    onTimeFinished,
    loop = true,
    pause,
    showMilli,
    backgrounds,
  } = props;

  const runTiming = (clock, value, dest) => {
    const config = {
      duration: time,
      toValue: new Value(0),
      easing: Easing.linear,
    };

    const state = {
      paused: new Value(0),
      started: new Value(0),
      finished: new Value(0),
      position: new Value(0),
      time: new Value(0),
      frameTime: new Value(0),
      timeSyncedWithClock: new Value(0),
    };

    return block([
      cond(
        clockRunning(clock),
        [
          cond(
            pauseFlag,
            [set(state.paused, 1), set(state.time, clock)],
            [set(state.paused, 0), set(config.toValue, dest)],
          ),
        ],
        [cond(not(state.started), [set(state.started, 1), startClock(clock)])],
      ),
      cond(not(state.paused), [
        call([state.frameTime], value => {
          if (showMilli) {
            setShowedTime(
              Number.parseFloat(value[0] / 1000).toFixed(showMilli),
            );
          } else setShowedTime(Math.floor(value[0] / 1000));
        }),
        timing(clock, state, config),
      ]),
      cond(state.finished, [
        call([], () => {
          setShowedTime(0);
        }),
        cond(
          loop,
          [
            stopClock(clock),
            set(state.finished, 0),
            set(state.time, 0),
            set(state.position, value),
            set(state.frameTime, 0),
            set(config.toValue, dest),
            call([], async () => {
              if (backgrounds !== undefined) {
                if (backgrounds.length === 1) {
                  setLastBackground(backgroundRef.current);
                  setBackground(randomColor());
                } else if (
                  backgrounds.length !==
                  backgrounds.indexOf(backgroundRef.current) + 1
                ) {
                  setLastBackground(backgroundRef.current);
                  setBackground(
                    backgrounds[
                      backgrounds.indexOf(lastBackgroundRef.current) + 1
                    ],
                  );
                } else {
                  setLastBackground(backgroundRef.current);
                  setBackground(backgrounds[0]);
                }
              } else {
                setLastBackground(backgroundRef.current);
                setBackground(randomColor());
              }
              if (onTimeFinished) onTimeFinished();
            }),
            // set(state.finished, 0),
            // set(state.time, 0),
            // set(state.position, value),
            // set(state.frameTime, 0),
            // set(config.toValue, dest),
            startClock(clock),
          ],
          [
            cond(clockRunning(clock), [
              call([], () => {
                if (onTimeFinished) onTimeFinished();
              }),
            ]),
            stopClock(clock),
          ],
        ),
      ]),
      state.position,
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
    multiply(divide(progress.current, 100), circumference),
  );

  const [showedTime, setShowedTime] = useState(0);

  useEffect(() => {
    if (backgrounds !== undefined) {
      if (backgrounds.length === 1) {
        setLastBackground(backgrounds[0]);
        setBackground(randomColor());
      } else if (backgrounds.length > 1) {
        setLastBackground(backgrounds[0]);
        setBackground(backgrounds[1]);
      } else if (backgrounds.length === 0) {
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
      '#' +
      Math.random()
        .toString(16)
        .slice(2, 8)
    );
  };

  const isHexColor = hex => {
    return typeof hex === 'string' && hex.length === 7 && hex[0] === '#';
  };

  const colourNameToHex = colour => {
    const colours = {
      aliceblue: '#f0f8ff',
      antiquewhite: '#faebd7',
      aqua: '#00ffff',
      aquamarine: '#7fffd4',
      azure: '#f0ffff',
      beige: '#f5f5dc',
      bisque: '#ffe4c4',
      black: '#000000',
      blanchedalmond: '#ffebcd',
      blue: '#0000ff',
      blueviolet: '#8a2be2',
      brown: '#a52a2a',
      burlywood: '#deb887',
      cadetblue: '#5f9ea0',
      chartreuse: '#7fff00',
      chocolate: '#d2691e',
      coral: '#ff7f50',
      cornflowerblue: '#6495ed',
      cornsilk: '#fff8dc',
      crimson: '#dc143c',
      cyan: '#00ffff',
      darkblue: '#00008b',
      darkcyan: '#008b8b',
      darkgoldenrod: '#b8860b',
      darkgray: '#a9a9a9',
      darkgreen: '#006400',
      darkkhaki: '#bdb76b',
      darkmagenta: '#8b008b',
      darkolivegreen: '#556b2f',
      darkorange: '#ff8c00',
      darkorchid: '#9932cc',
      darkred: '#8b0000',
      darksalmon: '#e9967a',
      darkseagreen: '#8fbc8f',
      darkslateblue: '#483d8b',
      darkslategray: '#2f4f4f',
      darkturquoise: '#00ced1',
      darkviolet: '#9400d3',
      deeppink: '#ff1493',
      deepskyblue: '#00bfff',
      dimgray: '#696969',
      dodgerblue: '#1e90ff',
      firebrick: '#b22222',
      floralwhite: '#fffaf0',
      forestgreen: '#228b22',
      fuchsia: '#ff00ff',
      gainsboro: '#dcdcdc',
      ghostwhite: '#f8f8ff',
      gold: '#ffd700',
      goldenrod: '#daa520',
      gray: '#808080',
      green: '#008000',
      greenyellow: '#adff2f',
      honeydew: '#f0fff0',
      hotpink: '#ff69b4',
      'indianred ': '#cd5c5c',
      indigo: '#4b0082',
      ivory: '#fffff0',
      khaki: '#f0e68c',
      lavender: '#e6e6fa',
      lavenderblush: '#fff0f5',
      lawngreen: '#7cfc00',
      lemonchiffon: '#fffacd',
      lightblue: '#add8e6',
      lightcoral: '#f08080',
      lightcyan: '#e0ffff',
      lightgoldenrodyellow: '#fafad2',
      lightgrey: '#d3d3d3',
      lightgreen: '#90ee90',
      lightpink: '#ffb6c1',
      lightsalmon: '#ffa07a',
      lightseagreen: '#20b2aa',
      lightskyblue: '#87cefa',
      lightslategray: '#778899',
      lightsteelblue: '#b0c4de',
      lightyellow: '#ffffe0',
      lime: '#00ff00',
      limegreen: '#32cd32',
      linen: '#faf0e6',
      magenta: '#ff00ff',
      maroon: '#800000',
      mediumaquamarine: '#66cdaa',
      mediumblue: '#0000cd',
      mediumorchid: '#ba55d3',
      mediumpurple: '#9370d8',
      mediumseagreen: '#3cb371',
      mediumslateblue: '#7b68ee',
      mediumspringgreen: '#00fa9a',
      mediumturquoise: '#48d1cc',
      mediumvioletred: '#c71585',
      midnightblue: '#191970',
      mintcream: '#f5fffa',
      mistyrose: '#ffe4e1',
      moccasin: '#ffe4b5',
      navajowhite: '#ffdead',
      navy: '#000080',
      oldlace: '#fdf5e6',
      olive: '#808000',
      olivedrab: '#6b8e23',
      orange: '#ffa500',
      orangered: '#ff4500',
      orchid: '#da70d6',
      palegoldenrod: '#eee8aa',
      palegreen: '#98fb98',
      paleturquoise: '#afeeee',
      palevioletred: '#d87093',
      papayawhip: '#ffefd5',
      peachpuff: '#ffdab9',
      peru: '#cd853f',
      pink: '#ffc0cb',
      plum: '#dda0dd',
      powderblue: '#b0e0e6',
      purple: '#800080',
      rebeccapurple: '#663399',
      red: '#ff0000',
      rosybrown: '#bc8f8f',
      royalblue: '#4169e1',
      saddlebrown: '#8b4513',
      salmon: '#fa8072',
      sandybrown: '#f4a460',
      seagreen: '#2e8b57',
      seashell: '#fff5ee',
      sienna: '#a0522d',
      silver: '#c0c0c0',
      skyblue: '#87ceeb',
      slateblue: '#6a5acd',
      slategray: '#708090',
      snow: '#fffafa',
      springgreen: '#00ff7f',
      steelblue: '#4682b4',
      tan: '#d2b48c',
      teal: '#008080',
      thistle: '#d8bfd8',
      tomato: '#ff6347',
      turquoise: '#40e0d0',
      violet: '#ee82ee',
      wheat: '#f5deb3',
      white: '#ffffff',
      whitesmoke: '#f5f5f5',
      yellow: '#ffff00',
      yellowgreen: '#9acd32',
    };

    if (colour === undefined) return false;
    else if (typeof colours[colour.toLowerCase()] != 'undefined') return true;
    else return false;
  };

  return (
    <View
      elevation={5}
      style={{
        height: radius * 0.8,
        width: radius * 0.8,
        borderRadius: radius * 0.8 * 4,
        backgroundColor: 'transparent',
        shadowOpacity: 1,
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowColor: '#000000',
        shadowRadius: 3,
      }}>
      <Svg height="100%" width="100%">
        {isHexColor(lastBackground) || colourNameToHex(lastBackground) ? (
          <AnimatedCircle
            fill={lastBackground}
            r={normalizedRadius * 2}
            cx={(radius * 0.8) / 2}
            cy={(radius * 0.8) / 2}
          />
        ) : (
          <Fragment>
            <Defs>
              <ClipPath id="clip">
                <AnimatedCircle
                  r={normalizedRadius * 2}
                  cx={(radius * 0.8) / 2}
                  cy={(radius * 0.8) / 2}
                />
              </ClipPath>
            </Defs>

            <Image
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid slice"
              href={lastBackground}
              clipPath="url(#clip)"
            />
          </Fragment>
        )}

        {isHexColor(background) || colourNameToHex(background) ? (
          <AnimatedCircle
            stroke={background}
            fill={'transparent'}
            strokeWidth={radius * 0.4}
            strokeDasharray={circumference + ' ' + circumference}
            style={{strokeDashoffset}}
            strokeWidth={radius * 0.4}
            r={normalizedRadius}
            cx={(radius * 0.8) / 2}
            cy={(radius * 0.8) / 2}
          />
        ) : (
          <Fragment>
            <Defs>
              <Pattern
                id="backgroundImage"
                patternUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="100%"
                height="100%">
                <Image
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  preserveAspectRatio="xMidYMid slice"
                  href={background}
                />
              </Pattern>
            </Defs>

            <AnimatedCircle
              stroke={'url(#backgroundImage)'}
              fill={'transparent'}
              strokeWidth={radius * 0.4}
              strokeDasharray={circumference + ' ' + circumference}
              style={{strokeDashoffset}}
              strokeWidth={radius * 0.4}
              r={normalizedRadius}
              cx={(radius * 0.8) / 2}
              cy={(radius * 0.8) / 2}
            />
          </Fragment>
        )}
      </Svg>
      {showTime ? (
        <View
          style={{
            position: 'absolute',
            backgroundColor: 'transparent',
            height: '100%',
            width: '100%',
            justifyContent: 'center',
          }}>
          <Text
            style={[
              {
                color: 'white',
                textAlign: 'center',
                fontSize: radius * 0.4,
              },
              textStyle,
            ]}>
            {showedTime}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default AnimatedTimer;
