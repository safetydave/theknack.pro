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
var wheel_score = -1;
var wheel_up = false;

function predict() {
    console.log('predicting');
    x_arr = acc_prev.concat(acc_now);
    x = tf.tensor([x_arr]);
    y = model.predict(x);
    wheel_score = y.arraySync()[0][0];
    wheel_up = wheel_score > 0.5;
    updateDisplay('y', wheel_score);
}

var sample_interval = 100;
var ts_count = 0;
var ts_prev;

var G = 9.8;
var MU = [-0.546, -0.746, -0.009];
var STD = [0.431, 0.285, 0.233];

function normComp(comp, i) {
  return (comp / G);
  //return (comp / G - MU[i]) / STD[i];
}

function normAcc(acc) {
  return [normComp(acc.x, 0), normComp(acc.y, 1), normComp(acc.z, 2)];
}

function handleMotion(event) {
  ts_now = Date.now();
  acc = event.accelerationIncludingGravity;
  if (ts_count == 0) {
    acc_now = normAcc(acc);
    ts_prev = ts_now;
    ++ts_count;
  }
  else {
    if (ts_now - ts_prev >= sample_interval) {
        acc_prev = acc_now;
        acc_now = normAcc(acc);
        predict();
        if (ts_count < 100) {
        $('#history-log').prepend('<p>'
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
  updateDisplay('acc_x', acc.x);
  updateDisplay('acc_y', acc.y);
  updateDisplay('acc_z', acc.z);
  //updateDisplay('interval', event.interval);
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