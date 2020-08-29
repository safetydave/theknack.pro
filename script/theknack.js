// Predict helper - for 1 synchronous inference call
function predictLive(model, x_array) {
  x = tf.tensor([x_array]);
  y = model.predict(x);
  y_pred = y.arraySync()[0][0];
  y.dispose();
  return y_pred;  
}

// Timer helper
var knack_timer;

function startKnackTimer(update_function) {
  update_function(0);
  var start = Date.now();
  knack_timer = setInterval(function() {
    var delta = Date.now() - start;
    update_function(delta / 1000);
  }, 100);
}

function stopKnackTimer() {
  clearInterval(knack_timer);
}

// History helper
function pushKnackHistory(element, entry) {
  mod_entry = entry;
  if (mod_entry.length < 1) {
    mod_entry = "🚲"
  }
  element.prepend('<p>' + mod_entry + '</p>');
}

// Sample helper
var ks_array;
var ks_pointer = 0;
var KS_INTERVAL = 100;
var ks_ts_prev = null;

function rollKsPointer() {
  ks_pointer = (ks_pointer + 1) % ks_array.length;
}

function tryKnackSample(new_sample) {
  result = 0;
  ts_now = Date.now();
  if (ks_ts_prev === null || ts_now - ks_ts_prev >= KS_INTERVAL) {
    result = 1;
    ks_ts_prev = ts_now;
    ks_array[ks_pointer] = new_sample;
    rollKsPointer();
  }
  return result;
}

// Delta angle helper
function dotProd2(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}

function crossProd2(a, b) {
  return a[0] * b[1] - a[1] * b[0];
}

function deg2rad(deg) {
  return deg * Math.PI / 180.0;
}

function ang2vec(ang) {
  return [Math.cos(ang), Math.sin(ang)];
}

function angBetween(ang0, ang1) {
  v0 = ang2vec(ang0);
  v1 = ang2vec(ang1);
  angSize = Math.acos(dotProd2(v0, v1));
  angCross = crossProd2(v0, v1);
  return [angSize, angCross];
}
