import MLDemo from './MLDemo';
import carsData from './carsData';

(async function() {
  const neuralML = new MLDemo();
  neuralML.setData(carsData as Array<carType>);
  neuralML.createTensors();
  await neuralML.trainingNeuralModel();

  // const horsePowerToTest = 130;
  // const prediction = neuralML.getPredictionMiles_per_GallonWithHorsePower(horsePowerToTest);
  // console.log(`${horsePowerToTest} miles per gallon ⇋ horse power = ${prediction}`);
})();
/*
const model = Tensorflow.sequential();
model.add(Tensorflow.layers.dense({units: 100, activation: 'relu', inputShape: [10]}));
model.add(Tensorflow.layers.dense({units: 1, activation: 'linear'}));
model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});

const xs = Tensorflow.randomNormal([100, 10]);
const ys = Tensorflow.randomNormal([100, 1]);

model.fit(xs, ys, {
  epochs: 100,
  callbacks: {
    onEpochEnd: (epoch, log) => console.log(`Epoch ${epoch}: loss = ${(log as Tensorflow.Logs).loss}`)
  }
});
*/
