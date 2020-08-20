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
}

function startSensors() {
  if (
    DeviceMotionEvent &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    DeviceMotionEvent.requestPermission();
  }
  
  window.addEventListener("devicemotion", handleMotion);
}

document.addEventListener('DOMContentLoaded', startSensors);
//document.addEventListener('DOMContentLoaded', loadWam);