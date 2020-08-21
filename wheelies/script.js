
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
  if (value > 50.5) { 
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
  //updateDisplay('ori_a', event.alpha);
  updateDisplay('ori_b', event.beta);
  //updateDisplay('ori_c', event.gamma);
  
  monitorWheelie(event.beta);
}


function startSensors() {
  wheel_up = false;
  document.getElementById("bg").style = "font-family:sans-serif;background-color:yellow";
  document.getElementById("start_button").innerHTML = "wheelie session";
  if (
    DeviceMotionEvent &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    DeviceMotionEvent.requestPermission();
  }
  
  window.addEventListener("devicemotion", handleMotion);
  window.addEventListener("deviceorientation", handleOrientation);
}

//document.addEventListener('DOMContentLoaded', startSensors);
//document.addEventListener('DOMContentLoaded', loadWam);