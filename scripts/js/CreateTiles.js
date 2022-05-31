
// imports
import { applySize } from './DOM&CSSManipulations.js';
import { tilePattern } from './Patterns.js';

// global variables
let randomNumbers = [];
let tiles = [];

// creates tiles
export default function createTiles(size, quantityRandomNumbers) {
  tiles = [];
  applySize(size);
  randomNumbers = getRandomNumbers(size * size, quantityRandomNumbers);
  for (let index = 0; index < size * size; index++) {
    createTile(index, index % size, size);
  }
  for (let index = 0; index < size * size; index++) {
    const mines = calculateNumberOfMinesAroundMe(tiles[index], size);
    tiles[index].numberOfMinesAroundMe = mines;
  }
  return tiles;
}

// creates individual tile
function createTile(index, rest, size) {
  // const indexReduced = index.toString().split('');
  // if (indexReduced.length == 1) indexReduced.unshift('0');
  const [row, column] = [Math.floor(index / size), rest];
  const id = parseInt(index + 1);
  const isMine = randomNumbers.some(number => number === id);
  const tile = {
    ...tilePattern,
    id: id,
    isMine: isMine,
    row: parseInt(row) + 1,
    column: parseInt(column) + 1
  };
  tiles.push(tile);
}

// calculating number of mine around individual tile
function calculateNumberOfMinesAroundMe(tile, size) {
  const [row, column] = [tile.row, tile.column];
  let br = 0;
  for (let i = row - 1; i <= row + 1; i++) {
    for (let k = column - 1; k <= column + 1; k++) {
      if (i == 0 && k == 0) continue;
      const potentialMine = findTile(i, k, size);
      if (potentialMine == null) continue;
      if (potentialMine.isMine) br++;
    }
  }
  return br;
}

// search for tile with specific row and column
export function findTile(row, column, size) {
  if (row < 1 || row > size || column < 1 || column > size) return null;
  return tiles.find(tile => tile.row == row && tile.column == column);
}

// returns array of random numbers between 0 and 100
function getRandomNumbers(max, size) {
  const numbers = new Set([]);
  while (numbers.size < size) {
    const randomNumber = getRndInteger(1, max);
    numbers.add(parseInt(randomNumber));
  }
  return [...numbers];
}

// returns random number between min and max values
function getRndInteger(min, max) {
  return Math.random() * (max - min) + min;
}