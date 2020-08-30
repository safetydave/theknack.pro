var duration_model;

async function loadCoach() {
  duration_model = await tf.loadLayersModel('https://theknack.pro/wheelies/duration_model/model.json');
}

function updateDisplay(id, value){
  if (value != null)
    $('#'+id).html(value.toFixed(1));
}

var wheelie_time = 0;

function updateTimer(value){
  if (value != null) {
    wheelie_time = value;
  	num_rocks = Math.floor(value)
    $('#timer_rock').html("🤘".repeat(num_rocks));
    $('#timer_time').html(value.toFixed(1));
  }
}

function prepareFeatures() {
  input = getKnackSamples();
  features = [];
  yaw_rad_0 = deg2rad(input[0][2]);
  for (i = 0; i < input.length; i++) {
    pitch_rad = deg2rad(input[i][0]);
    roll_rad = deg2rad(input[i][1]);
    yaw_rad = deg2rad(input[i][2]);
    yaw_rad_delta = angleBetween(yaw_rad_0, yaw_rad)[0];
    features[i] = [pitch_rad, roll_rad, yaw_rad_delta];
  }
  return features;
}

function resetCoachMessage() {
  $('#coach_message').html('');
}

function addCoachMessage(coach_says) {
  already_said = $('#coach_message').html();
  $('#coach_message').html(already_said + ',<br/>' + coach_says);
}

var wheel_up = false;
var dur_pred = 0;

function startWheelie() {
  wheelie_time = 0;
  resetCoachMessage();
  $('#history_log').html('');
  pushKnackHistory($('#history-data'), $('#timer_rock').html());
  startKnackTimer(updateTimer);
  setTimeout(function() {
    X = prepareFeatures();
    dur_pred = Math.max(0, predictLive(duration_model, X));
    if (isNaN(dur_pred)) {
      dur_pred = 0;
    }
    dur_pred_string = ' (' + dur_pred.toFixed(1) + 's)';
    coach_says = 'coach missed that';
    if (dur_pred > 0.1 && dur_pred < 2) {
      coach_says = 'work on your raise';
    }
    if (dur_pred >= 2 && dur_pred < 4) {
      coach_says = 'raise ok';
    }
    if (dur_pred >= 4) {
      coach_says = 'great raise';
    }
    coach_says += dur_pred_string;
    
    $('#coach_message').html(coach_says);
    //hist_string = X.map(function(x) { return '<br/>' + x; }) + '<br/>';
    //$('#history-log').html(hist_string);
  }, 500);
  $('#bg').addClass('wheelie-active');
  $('#bg').removeClass('sensors-active');
}

function stopWheelie() {
  stopKnackTimer();
  end_msg = '';
  if (wheelie_time < 2) {
   if (dur_pred < 2) {
     end_msg = 'keep working at it';
   }
   else if (dur_pred < 4) {
     end_msg = 'focus on balance';
   }
   else {
     end_msg = 'really focus on balance';
   }
  }
  else if (wheelie_time < 4) {
   if (dur_pred < 2) {
     end_msg = 'your balance improved';
   }
   else if (dur_pred < 4) {
     end_msg = 'balance ok';
   }
   else {
     end_msg = 'focus on balance';
   }
  }
  else if (wheelie_time < 8) {
   if (dur_pred < 2) {
     end_msg = 'amazing recovery, balance';
   }
   else if (dur_pred < 4) {
     end_msg = 'nice recovery, balance';
   }
   else {
     end_msg = 'great balance, keep it up';
   }
  }
  else {
    end_msg = 'super sweet wheelie!';
  }
  
  addCoachMessage(end_msg + ' (' + wheelie_time.toFixed(1) + 's)');
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
  current_roll = event.gamma;
  current_yaw = event.alpha;
  updateDisplay('ori_b', current_pitch);

  result = tryKnackSample([current_pitch, current_roll, current_yaw]);
  if (result) {
    //console.log(ks_array);
  }

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

  ks_array = [];
  for (i = 0; i < 25; i++) {
    ks_array[i] = [0, 0, 0];
  }

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

document.addEventListener('DOMContentLoaded', loadCoach);
