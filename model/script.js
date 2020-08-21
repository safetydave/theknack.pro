var model;

async function loadWam() {
  model = await tf.loadLayersModel('https://theknack.pro/model/h5js/model.json');
  //model = await tf.loadLayersModel('h5js/model.json');
}

function predict() {
    console.log('predicting');
    x = tf.tensor([[0, 0, 0, 0, 0, 0]]);
    y = model.predict(x);
    console.log(y.shape);
    console.log(y.arraySync()[0])
}

function updateDisplay(id, value){
  if (value != null)
    document.getElementById(id).innerHTML = value.toFixed(1);
}

function handleMotion(event) {
  updateDisplay('acc_x', event.acceleration.x);
  updateDisplay('interval', event.interval);
}

var sensors_started = false;

function startSensors() {
  if (DeviceMotionEvent &&
      typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission();
  }
  window.addEventListener("devicemotion", handleMotion);
  sensors_started = true;
}

document.addEventListener('DOMContentLoaded', loadWam);