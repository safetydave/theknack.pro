var model;

async function loadWam() {
  model = await tf.loadLayersModel('https://theknack.pro/model/h5js/model.json');
}

function updateDisplay(id, value){
  if (value != null)
    document.getElementById(id).innerHTML = value.toFixed(3);
}

var acc_now = [0, 0, 0];
var acc_prev = [0, 0, 0];
var wheel_up = -1;

function predict() {
    console.log('predicting');
    x_arr = acc_prev.concat(acc_now);
    x = tf.tensor([x_arr]);
    y = model.predict(x);
    wheel_up = y.arraySync()[0][0];
    updateDisplay('y', wheel_up);
}

var sample_interval = 100;
var ts_count = 0;
var ts_prev;

function handleMotion(event) {
  ts_now = Date.now();
  acc = event.acceleration;
  g = 9.8;
  if (ts_count == 0) {
    acc_now = [acc.x / g, acc.y / g, acc.z / g];
    ts_prev = ts_now;
    ++ts_count;
  }
  else {
    if (ts_now - ts_prev >= sample_interval) {
        acc_prev = acc_now;
        acc_now = [acc.x / g, acc.y / g, acc.z / g];
        predict();
        if (ts_count < 100) {
        $('#history-data').prepend('<p>'
          + ts_now + ', '
          + ts_prev + ', '
          + acc_now + ', '
          + acc_prev + ', '
          + wheel_up
          + '</p>');
        ts_prev = ts_now;
        ++ts_count;
        }
    }
  }
  updateDisplay('acc_x', event.acceleration.x);
  updateDisplay('interval', event.interval);
}

function startSensors() {
  if (DeviceMotionEvent &&
      typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission();
  }
  predict();
  window.addEventListener("devicemotion", handleMotion);
}

document.addEventListener('DOMContentLoaded', loadWam);