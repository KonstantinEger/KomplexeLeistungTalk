import { DrawingBoard } from '../lib';
import { randomFromArray } from '../lib/net/utils';
import * as TrainingData from '../lib/trainingdata.json';

// @ts-ignore
let trainingData: Array<{ grid: (0 | 255)[][]; label: number }> = TrainingData.default;
trainingData = trainingData.sort((a, b) => a.label - b.label);
const boards: DrawingBoard[] = [];

document.querySelector('#count').innerHTML = '' + trainingData.length;

for (let i = 0; i < trainingData.length; i++) {
  boards.push(new DrawingBoard());
  boards[i].displayPicture(trainingData[i]);
}
