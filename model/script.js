var model;

async function loadWam() {
  model = await tf.loadLayersModel('https://theknack.pro/model/h5js/model.json');
  //model = await tf.loadLayersModel('h5js/model.json');
}

function predict() {
    console.log('predicting');
    x_arr = acc_prev.concat(acc_now);
    x = tf.tensor([x_arr]);
    y = model.predict(x);
    updateDisplay('y', y.arraySync()[0], 2)
    console.log()
}

var acc_now = [0, 0, 0]
var acc_prev = [0, 0, 0]

function updateDisplay(id, value, precision=1){
  if (value != null)
    document.getElementById(id).innerHTML = value.toFixed(precision);
}

var sample_interval = 100;
var ts_count = 0;
var ts_prev;

function handleMotion(event) {
  ts_now = Date.now();
  acc = event.acceleration;
  if (ts_count == 0) {
    acc_now = [acc.x, acc.y, acc.z];
    ts_prev = ts_now;
    ++ts_count;
  }
  else {
    if (ts_now - ts_prev >= sample_interval) {
        acc_prev = acc_now;
        acc_now = [acc.x, acc.y, acc.z];
        ts_prev = ts_now;
        ++ts_count;
        predict();
    }
  }
  updateDisplay('acc_x', event.acceleration.x);
  updateDisplay('interval', event.interval, 3);
}

function startSensors() {
  if (DeviceMotionEvent &&
      typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission();
  }
  window.addEventListener("devicemotion", handleMotion);
}

document.addEventListener('DOMContentLoaded', loadWam);