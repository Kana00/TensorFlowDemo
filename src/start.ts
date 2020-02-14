import MLDemo from './MLDemo';
import carsData from './carsData';

(async function() {
  const neuralML = new MLDemo();

  neuralML.setData(carsData);
  await neuralML.trainingNeuralModel();

  // const horsePowerToTest = 130;
  // const prediction = neuralML.getPredictionMiles_per_GallonWithHorsePower(horsePowerToTest);
  // console.log(`${horsePowerToTest} miles per gallon ⇋ horse power = ${prediction}`);
})();
