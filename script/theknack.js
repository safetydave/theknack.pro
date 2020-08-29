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