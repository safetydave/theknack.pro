var model;

async function loadWam() {
  model = await tf.loadLayersModel('https://theknack.pro/model/h5js/model.json');
  //model = await tf.loadLayersModel('h5js/model.json');
}

function predict() {
    console.log('predicting');
    x = tf.tensor([[0, 0, 0, 0, 0, 0]]);
    y = model.predict(x);
    console.log(y.shape);
    console.log(y.arraySync()[0])
}

document.addEventListener('DOMContentLoaded', loadWam);