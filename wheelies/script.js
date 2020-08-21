
async function loadWam() {
  model = await tf.loadLayersModel('https://theknack.pro/wheelies/accel_model/model.json');
}

function updateDisplay(id, value){
  if (value != null)
    document.getElementById(id).innerHTML = value.toFixed(1);
}

function updateTimer(value){
  if (value != null) {
  	num_rocks = Math.floor(value)
    document.getElementById('timer_rock').innerHTML = "🤘".repeat(num_rocks);
    document.getElementById('timer_time').innerHTML = value.toFixed(1);
  }
}

var history_exists = false;
var history_rocks = '';

function addHistory() {
  if (history_exists) {
	$('#history-data').prepend('<p>' + history_rocks + '</p>');
  }
}

function handleMotion(event) {
  //updateDisplay('acc_x', event.acceleration.x);
  //updateDisplay('interval', event.interval);
}

var wheel_up = false;

function startWheelie() {
  startTimer();
  document.getElementById('bg').style = "font-family:sans-serif;background-color:green";
  addHistory();
}

function stopWheelie() {
  stopTimer();
  document.getElementById('bg').style = "font-family:sans-serif;background-color:yellow";
}

function monitorWheelie(value) {
  if (value > pitch_threshold) { 
    if (!wheel_up) startWheelie();
    wheel_up = true;
    history_exists = true;
  }
  else {
    if (wheel_up) stopWheelie();
    wheel_up = false;
  }
}

var wheelie_timer;

function startTimer() {
  history_rocks = document.getElementById('timer_rock').innerHTML;
  if (history_rocks.length < 1)
    history_rocks = "🚲"
  updateTimer(0);
  var start = Date.now();
  wheelie_timer = setInterval(function() {
    var delta = Date.now() - start;
    updateTimer(delta / 1000);
  }, 100);
}

function stopTimer() {
  clearInterval(wheelie_timer);
}

function handleOrientation(event) {
  current_pitch = event.beta;
  updateDisplay('ori_b', current_pitch);
  if (set_threshold_next_event) {
    pitch_threshold = current_pitch;
    updateDisplay('pitch_threshold', pitch_threshold);
    set_threshold_next_event = false;
  }
  if (session_started)
    monitorWheelie(current_pitch);
}

var sensors_started = false;
var session_started = false;
var current_pitch = 0;
var pitch_threshold = 50.5;
var set_threshold_next_event = false;

function setPitchThreshold() {
  if (!sensors_started)
    startSensors();
  set_threshold_next_event = true;
}

function startSession() {
  wheel_up = false;
  document.getElementById("bg").style = "font-family:sans-serif;background-color:yellow";
  document.getElementById("start_button").innerHTML = "wheelie session";
  if (!sensors_started)
    startSensors();
  session_started = true;
}

function startSensors() {
  if (
    DeviceMotionEvent &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    DeviceMotionEvent.requestPermission();
  }
  
  window.addEventListener("devicemotion", handleMotion);
  window.addEventListener("deviceorientation", handleOrientation);
  sensors_started = true;
}

//document.addEventListener('DOMContentLoaded', startSensors);
//document.addEventListener('DOMContentLoaded', loadWam);