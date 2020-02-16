import * as Tensorflow from '@tensorflow/tfjs-node';
import { Sequential, Tensor2D, Tensor, Rank } from '@tensorflow/tfjs-node';
import ConsoleProgressBar from './ConsoleProgressBar';

export default class MLDemo {
  private neuralModel: Sequential;
  private trainingSet: any;
  private inputTensor: Tensor2D | undefined;
  private labelTensor: Tensor2D | undefined;
  private inputMax: Tensor<Rank> | undefined;
  private inputMin: Tensor<Rank> | undefined;
  private labelMax: Tensor<Rank> | undefined;
  private labelMin: Tensor<Rank> | undefined;
  private batchSize = 32; // the size of the batch valeurs for each learn iteration
  private epochs = 100; // the number of learn iteration (compare with loss function N times)
  inputTensorNormalized: Tensor<Rank> | undefined;
  labelTensorNormalized: Tensor<Rank> | undefined;
  consoleProgressBar = new ConsoleProgressBar('Machine learning progress', process.stdout.columns - 14, 0, this.epochs);

  constructor() {
    // create neural model
    this.neuralModel = Tensorflow.sequential();

    const layer1 = Tensorflow.layers.dense({ inputShape: [1], units: 40, useBias: true });
    const layer2 = Tensorflow.layers.dense({ units: 50 });
    const layer3 = Tensorflow.layers.dense({ units: 50, activation: 'relu' });
    const layer4 = Tensorflow.layers.dense({ units: 50 });
    const layer5 = Tensorflow.layers.dense({ units: 1, useBias: true });

    this.neuralModel.add(layer1);
    this.neuralModel.add(layer2);
    this.neuralModel.add(layer3);
    this.neuralModel.add(layer4);
    this.neuralModel.add(layer5);

    // set parameters of training method
    this.neuralModel.compile({
      optimizer: Tensorflow.train.adam(),
      loss: Tensorflow.losses.meanSquaredError,
      metrics: ['mse'],
    });
  }

  setData(datas: Array<carType>) {
    // format datas
    this.trainingSet = datas.map((car: carType) => ({
      Miles_per_Gallon: car.Miles_per_Gallon,
      Horsepower: car.Horsepower,
    }));

    // clean wrong values
    this.trainingSet = this.trainingSet.filter((car: carType) => (car.Miles_per_Gallon != null && car.Horsepower != null));
  }

  createTensors() {
    // create intermediaite Tensors

    Tensorflow.util.shuffle(this.trainingSet);

    const listOfInputs = this.trainingSet.map((oneData: carType) => oneData.Horsepower);
    const listOfLabels = this.trainingSet.map((oneLabel: carType) => oneLabel.Miles_per_Gallon);

    this.inputTensor = Tensorflow.tensor2d(listOfInputs, [listOfInputs.length, 1]);
    this.labelTensor = Tensorflow.tensor2d(listOfLabels, [listOfLabels.length, 1]);

    // define extremum with min max method helper
    this.inputMax = this.inputTensor.max();
    this.inputMin = this.inputTensor.min();
    this.labelMax = this.labelTensor.max();
    this.labelMin = this.labelTensor.min();

    // normalize values between 0 ⟷ 1 to help learning phasis
    // rage-normalized absolute différence algorythme:
    // Ai(normalized) = (Ai - Amax) / (Amax - Amin)
    this.inputTensorNormalized = this.inputTensor.sub(this.inputMin).div(this.inputMax.sub(this.inputMin));
    this.labelTensorNormalized = this.labelTensor.sub(this.labelMin).div(this.labelMax.sub(this.labelMin));
  }

  setNumberOfEpochs(numberOfRepetition: number) {
    this.epochs = numberOfRepetition;
  }

  private callbacksFeedBack(): Tensorflow.CustomCallbackArgs | Tensorflow.CustomCallbackArgs[] {
    /**
     *  onTrainBegin?: (logs?: Logs) => void | Promise<void>;
        onTrainEnd?: (logs?: Logs) => void | Promise<void>;
        onEpochBegin?: (epoch: number, logs?: Logs) => void | Promise<void>;
        onEpochEnd?: (epoch: number, logs?: Logs) => void | Promise<void>;
        onBatchBegin?: (batch: number, logs?: Logs) => void | Promise<void>;
        onBatchEnd?: (batch: number, logs?: Logs) => void | Promise<void>;
        onYield?: (epoch: number, batch: number, logs: Logs) => void | Promise<void>;
     */
    return new Tensorflow.CustomCallback({
      onEpochEnd: (epoch, log) => {
        if (log !== undefined) {
          // process.stdout.clearLine(0);
          // process.stdout.cursorTo(0, 0);
          this.consoleProgressBar.setLoadingStyle('dote');
          this.consoleProgressBar.setProgressBarStyle('basic');
          this.consoleProgressBar.staticDraw(epoch + 1);
          // process.stdout.write('\n');
          process.stdout.write(`Loss ➔ ${(log.loss * 100).toFixed(2)}\n`);
          process.stdout.write(` Error ➔ ${(log.mse * 100).toFixed(2)}`);
          process.stdout.clearLine(1);
        }
      }
    });
  }

  async trainingNeuralModel() {
    // console.clear();
    const configurationFitingPhasis: Tensorflow.ModelFitArgs = {
      batchSize: this.batchSize,
      epochs: this.epochs,
      shuffle: true,
      verbose: 0,
      callbacks: this.callbacksFeedBack() as Tensorflow.CustomCallbackArgs
    };

    // waiting for the end of training
    if (this.inputTensorNormalized !== undefined && this.labelTensorNormalized !== undefined) {
      await this.neuralModel.fit(this.inputTensorNormalized, this.labelTensorNormalized, configurationFitingPhasis);
    } else {
      console.log('this.labelTensor or this.inputTensor is undefined');
    }
  }

  getPredictionMiles_per_GallonWithHorsePower(horsePower: number): number {
    // @ts-ignore
    const prediction = Tensorflow.tidy(() => {

      // const xRange = Tensorflow.linspace(0, , 1);
      const valueWanted = Tensorflow.tensor1d([horsePower]);
      // normalized this tensor
      // @ts-ignore
      const xRange = valueWanted.sub(this.inputMin).div(this.inputMax.sub(this.inputMin));
      const prediction = this.neuralModel.predict(xRange);

      // Unormalization ➔ Ai = Ai(normalized) * (Amax - Amin) + Amax
      if(this.inputMax !== undefined && this.inputMin !== undefined && this.labelMax !== undefined && this.labelMin !== undefined) {
        const unNormalizationX = xRange.mul(this.inputMax.sub(this.inputMin)).add(this.inputMin);
        // @ts-ignore
        const unNormalizationPrediction = prediction.mul(this.labelMax.sub(this.labelMin)).add(this.labelMin);
        // Un-normalize the data
        return unNormalizationPrediction.dataSync();
      }
    });

    return prediction[0];
  }
}
