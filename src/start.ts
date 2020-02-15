import MLDemo from './MLDemo';
import carsData from './carsData';

(async function() {
  const neuralML = new MLDemo();
  neuralML.setData(carsData as Array<carType>);
  await neuralML.createTensors();
  await neuralML.trainingNeuralModel();

  const horsePowerToTest = 80;
  const prediction = neuralML.getPredictionMiles_per_GallonWithHorsePower(horsePowerToTest);
  console.log(`${horsePowerToTest} horse power ⇋ miles per gallon = ${prediction}`);
})();
