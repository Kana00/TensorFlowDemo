import MLDemo from './MLDemo';

(async function() {

  const carsDataReq = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json');
  const carsData = await carsDataReq.json();

  const neuralML = new MLDemo();
  neuralML.setData(carsData);
  neuralML.setNumberOfEpochs(20);
  await neuralML.trainingNeuralModel();
})();
