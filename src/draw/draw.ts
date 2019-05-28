import { DrawingBoard, NeuralNet } from '../lib';
import * as ImportedNet300000 from '../lib/trainednet300000.json';
import * as ImportedNet50000 from '../lib/trainednet50000.json';

let trainedStatus: '0' | '50000' | '300000' = '0';
const board = new DrawingBoard(document.querySelector('#canvas'));

const resultDiv = document.querySelector('#result');
const statusDiv = document.querySelector('#status');

main();

function main() {
  let NN = new NeuralNet();
  if (trainedStatus === '0') {
    statusDiv.innerHTML = '0x trainiert';
  } else if (trainedStatus === '300000') {
    NN = NeuralNet.fromObject(ImportedNet300000);
    statusDiv.innerHTML = '300.000x trainiert';
  } else if (trainedStatus === '50000') {
    NN = NeuralNet.fromObject(ImportedNet50000);
    statusDiv.innerHTML = '50.000x trainiert';
  }
  board.onDraw(() => {
    const res = NN.feedforward(board.exportCellsAsArray());
    const guess = res.reduce(
      (acc, v, i) => {
        if (v > acc.val) {
          return { val: v, index: i };
        } else return acc;
      },
      { val: 0, index: -1 }
    );
    resultDiv.innerHTML = `<h3>Scheint zu ${Math.round(guess.val * 100)}% eine <b>${
      guess.index
    }</b> zu sein.</h3>`;
  });
  board.enableDrawingMode();
}

document.querySelector('#switch-netstatus').addEventListener('click', () => {
  switch (trainedStatus) {
    case '0': {
      trainedStatus = '50000';
      break;
    }
    case '50000': {
      trainedStatus = '300000';
      break;
    }
    case '300000': {
      trainedStatus = '0';
      break;
    }
  }
  board.reset();
  main();
});

document.querySelector('#clear').addEventListener('click', () => {
  board.reset();
});
