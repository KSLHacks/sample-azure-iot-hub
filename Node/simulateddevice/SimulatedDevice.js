'use strict';

var clientFromConnectionString = require('azure-iot-device-amqp').clientFromConnectionString;
var Message = require('azure-iot-device').Message;
var env = require('./env.js');
var iotHubHostName = process.env.iotHubUri;
var yourDeviceKey = process.env.devicekey;
var connectionString = 'HostName=' + iotHubHostName + 
                      ';DeviceId=myFirstNodeDevice;SharedAccessKey=' + yourDeviceKey +'\'';

var client = clientFromConnectionString(connectionString);

// display output from the application
function printResultFor(op) {
   return function printResult(err, res) {
     if (err) console.log(op + ' error: ' + err.toString());
     if (res) console.log(op + ' status: ' + res.constructor.name);
   };
 }

// Create a callback and use the setInterval function to send a new message to your IoT hub every second
 var connectCallback = function (err) {
   if (err) {
     console.log('Could not connect: ' + err);
   } else {
     console.log('Client connected');

     // Create a message and send it to the IoT Hub every second
     setInterval(function(){
         var windSpeed = 10 + (Math.random() * 4);
         var data = JSON.stringify({ deviceId: 'myFirstNodeDevice', windSpeed: windSpeed });
         var message = new Message(data);
         console.log("Sending message: " + message.getData());
         client.sendEvent(message, printResultFor('send'));
     }, 1000);
   }
 };

// Open the connection to your IoT Hub and start sending messages:
client.open(connectCallback);