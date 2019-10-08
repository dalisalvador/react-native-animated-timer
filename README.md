
# react-native-animated-timer     ⏰

A simple animated timer implementing [react-native-reanimated](https://github.com/kmagiera/react-native-reanimated) and [react-native-svg](https://github.com/react-native-community/react-native-svg) libraries.
 
## Examples

## Installation
`npm install react-native-animated-timer`

## Usage

    import {Timer} from  'react-native-animated-timer';
    
    <Timer
	    radius={350}
	    time={10000}
	    checkPoints={[{time: 1210.23, callback: () => alert('First Check Point')},
	    	        {time: 5310, callback: () => alert('Second Check Point')}]}
	    backgrounds={['blue', 'red', 'http://myimage.com/img1.png']}
	    showTime={true}
	    onTimeFinished={() => alert('AnimatedTimer has finished')}
	    loop={true}
	    pause={pauseFlag}
	    textStyle={{
	    	color:  'red',
	    	fontWeight:  'bold',
	    }}
	    showMilli={2}
    />

## Properties


|  Prop 	|Type		|Default   |Required |	Description  |
|----------------|-------------------------------|-----------------------------|--|--|
|radius|`number`|`100`|`true`|radius of the circle
|time|`number`|`5000`|`true`|time of one lap in milliseconds
|backgrounds|`array`|`none`|`false`|array of colors or images that will appear in sequence (left-right). Example: `backgrounds={['blue',require('./img/image1'), 'red','https://myimage.com/img2.png']}`
|checkPoints|`array`|`none`|`false`|array of objects containing a callback to be executed at a particular time (precision ~65ms). Example:`checkPoints={[{ time: 1120, callback: () => myfunc1()}, { time: 5120, callback: () => myfunc2()}]}`
|onTimeFinished|`function`|`none`|`false`|Executes function when the timer finishes.
|pause|`boolean`|`false`|`false`|Stops the timer
|showTime|`boolean`|`false`|`false`|Shows the elapsed time
|showMilli|`number`|`false`|`false`|Shows `number` of milliseconds after the comma.
|loop|`boolean`|`true`|`false`|An endless loop of timer.
|textStyle|`object`|`none`|`false`|style the text showed `showTime={true}`



</table><h2 id="license">License</h2>
<p>react-native-animated-timer is licensed under <a href="LICENSE">The MIT License</a>.</p>
