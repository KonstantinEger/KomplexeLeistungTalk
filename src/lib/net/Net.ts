import { Matrix } from '../matrix/Matrix';
import { randomInitializer, sigmoid, randomFromArray, dsigmoid } from './utils';

class NeuralNet {
  private INPUT_NODES = 576;
  private H1_NODES = 16;
  private H2_NODES = 16;
  private OUTPUT_NODES = 10;
  private BIAS = 1;
  private LEARNING_RATE = 0.01;

  private weightsIH1: Matrix;
  private hidden1: Matrix;
  private weightsH1H2: Matrix;
  private hidden2: Matrix;
  private weightsH2O: Matrix;
  private output: Matrix;

  constructor() {
    this.weightsIH1 = new Matrix(this.H1_NODES, this.INPUT_NODES, randomInitializer);
    this.hidden1 = new Matrix(this.H1_NODES, 1, randomInitializer);

    this.weightsH1H2 = new Matrix(this.H2_NODES, this.H1_NODES, randomInitializer);
    this.hidden2 = new Matrix(this.H2_NODES, 1, randomInitializer);

    this.weightsH2O = new Matrix(this.OUTPUT_NODES, this.H2_NODES, randomInitializer);
    this.output = new Matrix(this.OUTPUT_NODES, 1, () => 0);
  }

  public feedforward(inputArray: number[]) {
    let inputs = Matrix.from1DArray(inputArray);
    inputs = inputs.map(sigmoid);
    let hidden = Matrix.multiply(this.weightsIH1, inputs);
    hidden = hidden.map(v => v + this.BIAS);
    hidden = hidden.map(sigmoid);
    this.hidden1 = hidden;

    hidden = Matrix.multiply(this.weightsH1H2, hidden);
    hidden.map(v => v + this.BIAS);
    hidden = hidden.map(sigmoid);
    this.hidden2 = hidden;

    let output = Matrix.multiply(this.weightsH2O, hidden);
    output.map(v => v + this.BIAS);
    output = output.map(sigmoid);
    this.output = output;

    return Matrix.to1DArray(this.output);
  }

  public train(trainingData: TrainingData[], iterations?: number) {
    if (!iterations) iterations = 60000;

    for (let x = 0; x < iterations; x++) {
      const dataPoint: TrainingData = randomFromArray(trainingData);

      let inputs = Matrix.from1DArray(dataPoint.data);
      inputs = inputs.map(sigmoid);
      let output = Matrix.from1DArray(this.feedforward(dataPoint.data));
      let target = Matrix.from1DArray(dataPoint.expected);

      let error = Matrix.subtract(target, output);

      let gradients = output.map(dsigmoid);
      gradients = gradients.map((v, r, c) => v * error.get(r, c));
      gradients = gradients.map(v => v * this.LEARNING_RATE);

      let hidden_t = Matrix.transpose(this.hidden2);
      let weightsH2O_delta = Matrix.multiply(gradients, hidden_t);

      this.weightsH2O = this.weightsH2O.map((v, r, c) => v + weightsH2O_delta.get(r, c));

      let weightsH2O_t = Matrix.transpose(this.weightsH2O);
      error = Matrix.multiply(weightsH2O_t, error);

      gradients = this.hidden2.map(dsigmoid);
      gradients = gradients.map((v, r, c) => v * error.get(r, c));
      gradients = gradients.map(v => v * this.LEARNING_RATE);

      hidden_t = Matrix.transpose(this.hidden1);
      let weightsH1H2_delta = Matrix.multiply(gradients, hidden_t);
      this.weightsH1H2 = this.weightsH1H2.map((v, r, c) => v + weightsH1H2_delta.get(r, c));

      let weightsH1H2_t = Matrix.transpose(this.weightsH1H2);
      error = Matrix.multiply(weightsH1H2_t, error);

      gradients = this.hidden1.map(dsigmoid);
      gradients = gradients.map((v, r, c) => v * error.get(r, c));
      gradients = gradients.map(v => v * this.LEARNING_RATE);

      let input_t = Matrix.transpose(inputs);
      let weightsIH1_delta = Matrix.multiply(gradients, input_t);
      this.weightsIH1 = this.weightsIH1.map((v, r, c) => v + weightsIH1_delta.get(r, c));
    }
  }

  public static fromObject(obj: any) {
    const result = new NeuralNet();
    result.BIAS = obj.BIAS;
    result.H1_NODES = obj.H1_NODES;
    result.H2_NODES = obj.H2_NODES;
    result.INPUT_NODES = obj.INPUT_NODES;
    result.LEARNING_RATE = obj.LEARNING_RATE;
    result.OUTPUT_NODES = obj.OUTPUT_NODES;

    result.hidden1 = Matrix.fromOBJ(obj.hidden1);
    result.hidden2 = Matrix.fromOBJ(obj.hidden2);
    result.output = Matrix.fromOBJ(obj.output);
    result.weightsH1H2 = Matrix.fromOBJ(obj.weightsH1H2);
    result.weightsH2O = Matrix.fromOBJ(obj.weightsH2O);
    result.weightsIH1 = Matrix.fromOBJ(obj.weightsIH1);

    return result;
  }
}

interface TrainingData {
  data: number[];
  expected: number[];
}

export { NeuralNet };
