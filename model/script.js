
async function loadWam() {
  model = await tf.loadLayersModel('https://theknack.pro/model/h5js/model.json');
  //model = await tf.loadLayersModel('h5js/model.json');
}

document.addEventListener('DOMContentLoaded', loadWam);