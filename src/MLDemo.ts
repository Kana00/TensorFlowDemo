import * as Tensorflow from '@tensorflow/tfjs-node';
import { Sequential, Tensor2D } from '@tensorflow/tfjs-node';


export default class MLDemo {
  private neuralModel: Sequential;
  private trainingSet: any;
  private inputTensor: Tensor2D | undefined;
  private labelTensor: Tensor2D | undefined;
  private inputMax: Tensorflow.Tensor<Tensorflow.Rank> | undefined;
  private inputMin: Tensorflow.Tensor<Tensorflow.Rank> | undefined;
  private labelMax: Tensorflow.Tensor<Tensorflow.Rank> | undefined;
  private labelMin: Tensorflow.Tensor<Tensorflow.Rank> | undefined;
  private batchSize = 32; // the size of the batch valeurs for each learn iteration
  private epochs = 28; // the number of learn iteration (compare with loss function N times)
  inputTensorNormalized: Tensorflow.Tensor<Tensorflow.Rank> | undefined;
  labelTensorNormalized: Tensorflow.Tensor<Tensorflow.Rank> | undefined;

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
      onTrainBegin: async () => {
        console.log('training begin');
      }
    });
  }

  async trainingNeuralModel() {

    const configurationFitingPhasis: Tensorflow.ModelFitArgs = {
      batchSize: this.batchSize,
      epochs: this.epochs,
      shuffle: true,
      verbose: 1,
      callbacks: this.callbacksFeedBack as Tensorflow.CustomCallbackArgs
    };

    // waiting for the end of training
    if (this.inputTensorNormalized !== undefined && this.labelTensorNormalized !== undefined) {
      await this.neuralModel.fit(this.inputTensorNormalized, this.labelTensorNormalized, configurationFitingPhasis);
    } else {
      console.log('this.labelTensor or this.inputTensor is undefined');
    }
  }

  getPredictionMiles_per_GallonWithHorsePower(horsePower: number): number {

    return 0;
  }
}
