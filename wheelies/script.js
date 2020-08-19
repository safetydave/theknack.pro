console.log('Hello Wheelies');

async function loadWam() {
  model = await tf.loadLayersModel('https://theknack.pro/wheelies/accel_model');
}

document.addEventListener('DOMContentLoaded', loadWam);