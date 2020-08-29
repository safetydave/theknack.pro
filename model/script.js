var model;

async function loadWam() {
  model = await tf.loadLayersModel('https://theknack.pro/model/h5js/model.json');
}

function updateDisplay(id, value){
  if (value != null)
    $('#' + id).html(value.toFixed(2));
}

function updateTimer(value) {
  if (value != null) {
    num_rocks = Math.floor(value)
    $('#timer_rock').html("🤘".repeat(num_rocks));
    $('#timer_time').html(value.toFixed(1));
  }
}

function startWheelie() {
  pushKnackHistory($('#history-data'), $('#timer_rock').html());
  startKnackTimer(updateTimer);
  $('#bg').addClass('wheelie-active');
  $('#bg').removeClass('sensors-active');
}

function stopWheelie() {
  stopKnackTimer();
  $('#bg').addClass('sensors-active');
  $('#bg').removeClass('wheelie-active');
}

var acc_prev = [0, 0, -1];
var acc_now = [0, 0, -1];
var wheel_score = 0.0;
var wheel_up = false;

function predict() {
  console.log('predicting');
  x_arr = acc_prev.concat(acc_now);
  wheel_score = predictLive(model, x_arr);
  
  if (wheel_score > 0.5) {
    if (!wheel_up) startWheelie();
    wheel_up = true;
  }
  else {
    if (wheel_up) stopWheelie();
    wheel_up = false;
  }  
  
  updateDisplay('y', wheel_score);
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
  if (android) {
    acc.x = 0; //event.accelerationIncludingGravity.y;
    acc.y = 0; //event.accelerationIncludingGravity.x;
    acc.z = 0; //event.accelerationIncludingGravity.z;
  }
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

      if (ts_count < 0) {
        $('#history-log').prepend('<p>'
          + ts_now + ', '
          + ts_prev + ', '
          + acc_now + ', '
          + acc_prev + ', '
          + wheel_up
          + '</p>');
      }

      ts_prev = ts_now;
      ++ts_count;
    }
  }
  updateDisplay('acc_x', acc.x);
  updateDisplay('acc_y', acc.y);
  updateDisplay('acc_z', acc.z);
}

var session_started = false;
var android = false;

function startSession() {
  if (session_started)
    return;
  wheel_up = false;
  $('#bg').addClass('sensors-active');
  $('#start-action').css('display', 'none');
  $('#raw-readout').css('display', 'block');
  session_started = true;
}

function startSensors() {
  if (DeviceMotionEvent &&
      typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission();
  }
  userAgent = navigator.userAgent.toLowerCase();
  android = userAgent.indexOf("android") > -1;
  window.addEventListener("devicemotion", handleMotion);
  startSession();
}

document.addEventListener('DOMContentLoaded', loadWam);