import Tensorflow from '@tensorflow/tfjs-node';


export default class MLDemo {
  private neuralModel: Tensorflow.Sequential;
  private trainingSet: any;
  private inputTensor: Tensorflow.Tensor2D | undefined;
  private labelTensor: Tensorflow.Tensor2D | undefined;
  private inputMax: any;
  private inputMin: any;
  private labelMax: any;
  private labelMin: any;
  private batchSize = 32; // the size of the batch valeurs for each learn iteration
  private epochs = 28; // the number of learn iteration (compare with loss function N times)
  inputTensorNormalized: any;
  labelTensorNormalized: any;

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
  }

  setData(datas: any) {
    // format datas
    this.trainingSet = datas.map((car: any) => ({
      mpg: car.Miles_per_Gallon,
      horsepower: car.Horsepower,
    }));

    // clean wrong values
    this.trainingSet = this.trainingSet.filter((car: any) => (car.mpg != null && car.horsepower != null));

    this.initTensors();
  }

  private initTensors() {
    // create intermediaite Tensors
    Tensorflow.tidy(() => {

      Tensorflow.util.shuffle(this.trainingSet);

      const listOfInputs = this.trainingSet.map((oneData: any) => oneData.horsepower);
      const listOfLabels = this.trainingSet.map((oneLabel: any) => oneLabel.mpg);

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
    });
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

    // set parameters of training method
    this.neuralModel.compile({
      optimizer: Tensorflow.train.adam(),
      loss: Tensorflow.losses.meanSquaredError,
      metrics: ['mse'],
    });


    const configurationFitingModel: Tensorflow.ModelFitArgs = {
      batchSize: this.batchSize,
      epochs: this.epochs,
      shuffle: true,
      verbose: 1,
      callbacks: this.callbacksFeedBack as Tensorflow.CustomCallbackArgs
    };

    // waiting for the end of training
    await this.neuralModel.fit(this.inputTensorNormalized, this.labelTensorNormalized, configurationFitingModel);
  }
}
