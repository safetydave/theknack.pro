
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

var history_exists = false;
var history_rocks = '';

function addHistory() {
  if (history_exists) {
	$('#history-data').prepend('<p>' + history_rocks + '</p>');
  }
}

var wheel_up = false;

function startWheelie() {
  startTimer();
  $('#bg').addClass('wheelie-active');
  $('#bg').removeClass('sensors-active');
  addHistory();
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
    history_exists = true;
  }
  else {
    if (wheel_up) stopWheelie();
    wheel_up = false;
  }
}

function startTimer() {
  history_rocks = $('#timer_rock').html();
  if (history_rocks.length < 1)
    history_rocks = "🚲"
  startKnackTimer(updateTimer);
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
  $('#start_button_text').html('session active');
  $('#start_button').removeClass('btn-primary');
  $('#start_button').css('background', 'none');
  $('#start_button').css('border', '1px solid black');
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