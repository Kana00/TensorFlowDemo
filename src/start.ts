import MLDemo from './utils/MLDemo';
import carsData from './assets/carsData';
import readline from 'readline';

(async function () {
  console.clear();
  // ------------------------------------------------ Machine learning part
  const neuralML = new MLDemo();
  neuralML.setData(carsData as Array<carType>);
  neuralML.createTensors();
  await neuralML.trainingNeuralModel();

  // ------------------------------------------------ Console part
  // const rl = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout
  // });
  // rl.setPrompt("> How many horsepower does the car have ? ➔ ");
  // rl.prompt();
  // rl.on('line', function (horsepower) {
  //   const prediction = neuralML.getPredictionMiles_per_GallonWithHorsePower(Number.parseFloat(horsepower));
  //   console.log(`Miles per gallon ➔ ${prediction}\r`);
  //   rl.prompt();
  // }).on('close', function () {
  //   console.log("\nDemo by Kana00 Follow me on github https://github.com/Kana00");
  //   process.exit(0);
  // });
})();
