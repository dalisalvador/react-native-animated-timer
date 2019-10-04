import React from "react";
import AnimatedTimer from "./Components/AnimatedTimer";
import AnimatedTimerDraggable from "./Components/AnimatedTimerDraggable";

const Timer = ({ ...props }) => {
  const { draggable } = props;
  if (Platform.OS === "android") {
    return <AnimatedTimer {...props} />;
  } else {
    if (draggable) return <AnimatedTimerDraggable {...props} />;
    else return <AnimatedTimer {...props} />;
  }
};

export default Timer;
