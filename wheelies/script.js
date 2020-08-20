console.log('Hello Wheelies');

async function loadWam() {
  model = await tf.loadLayersModel('https://theknack.pro/wheelies/accel_model/model.json');
}

function updateDisplay(id, value){
  if (value != null)
    document.getElementById(id).innerHTML = value.toFixed(3);
}

function handleMotion(event) {
  updateDisplay('acc_x', event.acceleration.x);
  updateDisplay('interval', event.interval);
}

var wheel_up = false;

function startWheelie() {
  startTimer();
  document.getElementById('bg').style = "font-family:sans-serif;background-color:green";
}

function stopWheelie() {
  stopTimer();
  document.getElementById('bg').style = "font-family:sans-serif;background-color:yellow";
}

function monitorWheelie(value) {
  if (value > 50.5) { 
    if (!wheel_up) startWheelie();
    wheel_up = true;
  }
  else {
    if (wheel_up) stopWheelie();
    wheel_up = false;
  }
}

var wheelie_timer;

function startTimer() {
  var start = Date.now();
  wheelie_timer = setInterval(function() {
    var delta = Date.now() - start;
    updateDisplay('timer', Math.floor(delta / 1000));
  }, 1000);
}

function stopTimer() {
  clearInterval(wheelie_timer);
}

function handleOrientation(event) {
  updateDisplay('ori_a', event.alpha);
  updateDisplay('ori_b', event.beta);
  updateDisplay('ori_c', event.gamma);
  
  monitorWheelie(event.beta);
}


function startSensors() {
  wheel_up = false;
  document.getElementById("bg").style = "font-family:sans-serif;background-color:yellow";
  console.log("🤘".repeat(10));
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