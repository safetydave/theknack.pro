// Predict helper - for one live/online inference call
function predict_live(model, x_array) {
  x = tf.tensor([x_array]);
  y = model.predict(x);
  y_pred = y.arraySync()[0][0];
  y.dispose();
  return y_pred;  
}