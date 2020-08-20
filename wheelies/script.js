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

function handleOrientation(event) {
  updateDisplay('ori_a', event.alpha);
  updateDisplay('ori_b', event.beta);
  updateDisplay('ori_g', event.gamma);
  incrementEventCount();
}


function startSensors() {
  console.log('starting');
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