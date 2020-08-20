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

function showWheelie(value) {
  if (value > 50.5) 
    document.getElementById('bg').style = "font-family:sans-serif;background-color:green";
  else
    document.getElementById('bg').style = "font-family:sans-serif;background-color:yellow";
}

function handleOrientation(event) {
  updateDisplay('ori_a', event.alpha);
  updateDisplay('ori_b', event.beta);
  updateDisplay('ori_c', event.gamma);
  
  showWheelie(event.beta);
}


function startSensors() {
  document.getElementById("bg").style = "font-family:sans-serif;background-color:yellow";
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