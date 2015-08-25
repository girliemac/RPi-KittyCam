// var length = 12;
// var total = length + 1;
// var vrange = Math.floor(1023 / total);
// var ranges = Array.from({ length: total }, function(_, index) {
//   var start = vrange * index;

//   console.log(index, index + 1, start, start + vrange - 1);
//   return Array.from({ length: vrange - 1 }, function(_, index) {
//     return start + index;
//   });
// });

/*
 0 1 0 77
 1 2 78 155
 2 3 156 233
 3 4 234 311
 4 5 312 389
 5 6 390 467
 6 7 468 545
 7 8 546 623
 8 9 624 701
 9 10 702 779
 10 11 780 857
 11 12 858 935
 12 13 936 1013
*/

// GND ->
var a = 560;
// -> pin1
var b = 8200;
// -> pin2
var c = 18000;
// -> pin3
// ------> ADC
var d = 910;
// -> pin4
var e = 9100;
// -> pin5
var f = 15000;
// -> pin6
var g = 5100;
// -> pin7
var h = 51;
// -> VCC


var button1 = 1024 * ( a + b ) / ( a + b + d + e + f + g + h );
var button2 = 1024 * ( a + c ) / ( a + c + d + e + f + g + h );
var button3 = 1024 * ( a + b ) / ( a + b + f + g + h );
var button4 = 1024 * ( a + b + c ) / ( a + b + c + h );
var button5 = 1024 * ( a ) / ( a + h );
var button6 = 1024 * ( a + b + c ) / ( a + b + c + d + e + h );
var button7 = 1024 * ( a + b + c ) / ( a + b + c + g + h );
var button8 = 1024 * ( a ) / ( a + g + h );
var button9 = 1024 * ( a + b + c ) / ( a + b + c + d + e + g + h );
var button10 = 1024 * ( a + b + c ) / ( a + b + c + e + f + g + h );
var button11 = 1024 * ( a ) / ( a + e + f + g + h );
var button12 = 1024 * ( a + b + c ) / ( a + b + c + d + f + g + h );

console.log("button1 ", button1 );
console.log("button2 ", button2 );
console.log("button3 ", button3 );
console.log("button4 ", button4 );
console.log("button5 ", button5 );
console.log("button6 ", button6 );
console.log("button7 ", button7 );
console.log("button8 ", button8 );
console.log("button9 ", button9 );
console.log("button10", button10);
console.log("button11", button11);
console.log("button12", button12);
