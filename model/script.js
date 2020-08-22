var model;

async function loadWam() {
  model = await tf.loadLayersModel('https://theknack.pro/model/h5js/model.json');
}

function updateDisplay(id, value){
  if (value != null)
    $('#' + id).html(value.toFixed(3));
}

function startWheelie() {
  //startTimer();
  $('#bg').css('background-color','green');
  //addHistory();
}

function stopWheelie() {
  //stopTimer();
  $('#bg').css('background-color','yellow');
}


var acc_prev = [0, 0, 0];
var acc_now = [0, 0, 0];
var wheel_score = -1;
var wheel_up = false;

function predict() {
  console.log('predicting');
  x_arr = acc_prev.concat(acc_now);
  x = tf.tensor([x_arr]);
  y = model.predict(x);
  wheel_score = y.arraySync()[0][0];
  
  if (wheel_score > 0.5) {
    if (!wheel_up) startWheelie();
    wheel_up = true;
  }
  else {
    if (wheel_up) stopWheelie();
    wheel_up = false;
  }  
  
  updateDisplay('y', wheel_score);
  y.dispose();
}

var sample_interval = 100;
var ts_count = 0;
var ts_prev;

var ESG = 9.8;

function normAcc(acc) {
  return [acc.x / ESG, acc.y / ESG, acc.z / ESG];
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
        if (ts_count < 10) {
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

function startSession() {
  wheel_up = false;
  $('#bg').css('background-color', 'yellow');
  $('#start_button').html('wheelie session');
  session_started = true;
}

function startSensors() {
  if (DeviceMotionEvent &&
      typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission();
  }
  predict();
  window.addEventListener("devicemotion", handleMotion);
  startSession();
}

document.addEventListener('DOMContentLoaded', loadWam);