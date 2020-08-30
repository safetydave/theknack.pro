
function updateDisplay(id, value){
  if (value != null)
    $('#'+id).html(value.toFixed(1));
}

function updateTimer(value){
  if (value != null) {
  	num_rocks = Math.floor(value)
    $('#timer_rock').html("🤘".repeat(num_rocks));
    $('#timer_time').html(value.toFixed(1));
  }
}

var wheel_up = false;

function startWheelie() {
  $('#coach_message').html('');
  pushKnackHistory($('#history-data'), $('#timer_rock').html());
  startKnackTimer(updateTimer);
  setTimeout(function() {
    $('#coach_message').html('coach says keep it up');
  }, 500);
  $('#bg').addClass('wheelie-active');
  $('#bg').removeClass('sensors-active');
}

function stopWheelie() {
  stopKnackTimer();
  $('#bg').addClass('sensors-active');
  $('#bg').removeClass('wheelie-active');
}

function monitorWheelie(value) {
  if (value > pitch_threshold) { 
    if (!wheel_up) startWheelie();
    wheel_up = true;
  }
  else {
    if (wheel_up) stopWheelie();
    wheel_up = false;
  }
}

function handleOrientation(event) {
  current_pitch = event.beta;
  updateDisplay('ori_b', current_pitch);
  if (set_threshold_next_event) {
    pitch_threshold = current_pitch;
    updateDisplay('pitch_threshold', pitch_threshold);
    set_threshold_next_event = false;
  }
  if (session_started)
    monitorWheelie(current_pitch);
}

var sensors_started = false;
var session_started = false;
var current_pitch = 0;
var pitch_threshold = 50.5;
var set_threshold_next_event = false;

function setPitchThreshold() {
  if (!sensors_started)
    startSensors();
  set_threshold_next_event = true;
}

function startSession() {
  if (session_started)
    return;
  wheel_up = false;
  $('#bg').addClass('sensors-active');
  $('#start-action').css('display', 'none');
  $('#raw-readout').css('display', 'block');
  if (!sensors_started)
    startSensors();
  session_started = true;
}

function startSensors() {
  if (DeviceMotionEvent &&
      typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission();
  }
  window.addEventListener("deviceorientation", handleOrientation);
  sensors_started = true;
}