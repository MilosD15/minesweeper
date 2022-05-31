
// imports
import { applyState } from './DOM&CSSManipulations.js';
import { determineEmptyTilesAroundTile } from './Game.js';
import { TILE_STATES } from './Patterns.js';

// DOM elements
const board = document.querySelector('[data-board]');

// reveals empty tiles
export function revealEmptyTiles(tile, size, animation) {
  const emptyTiles = determineEmptyTilesAroundTile(tile, size);
  if (emptyTiles.length == 0) return;
  emptyTiles.forEach(({tile, direction}) => {
    setTimeout(() => {
      if (tile.state === TILE_STATES.NUMBER) return;
      tile.state = TILE_STATES.NUMBER;
      applyState(tile);
      const tileElement = board.querySelector(`[data-tile-id="${tile.id}"]`);
      animateTile(tileElement, animation.speed, direction, 'erase');
      setTimeout(() => {
        revealEmptyTiles(tile, size, animation);
      }, animation.speed * emptyTiles.length);
    }, animation.speed);
  });
}

// animates all tiles
export function animateTiles(size, speed) {
  const tiles = [...board.querySelectorAll('[data-tile]')];
  const order = makePattern(size);

  for (let i = 0; i < tiles.length; i++) {
    setTimeout(() => {
      animateTile(tiles[order[i] - 1], speed);
    }, speed * i);
  }
}

// animates a particular tile
export function animateTile(tileElement, speed, direction = 'topLeftToBottomRight', animation = 'create') {
  const wrapper = tileElement.querySelector('[data-state]');
  if (animation == 'create') {
    wrapper.dataset.state = 'hidden';
  }
  const pieces = [...wrapper.querySelectorAll('div')];
  const animationDuration = speed;
  const orderMap = new Map([
    ['bottomRightToTopLeft', reverseArray(makePattern(4))],
    ['bottomToTop', [13, 14, 15, 16, 9, 10, 11, 12, 5, 6, 7, 8, 1, 2, 3, 4]],
    ['bottomLeftToTopRight', [13, 9, 14, 5, 10, 15, 1, 6, 11, 16, 2, 7, 12, 3, 8, 4]],
    ['leftToRight', [1, 5, 9, 13,  2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16]],
    ['rightToLeft', reverseArray([1, 5, 9, 13,  2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16])],
    ['topLeftToBottomRight', makePattern(4)],
    ['topToBottom', reverseArray([13, 14, 15, 16, 9, 10, 11, 12, 5, 6, 7, 8, 1, 2, 3, 4])],
    ['topRightToBottomLeft', reverseArray([13, 9, 14, 5, 10, 15, 1, 6, 11, 16, 2, 7, 12, 3, 8, 4])]
  ]);
  const order = orderMap.get(direction);

  for (let i = 0; i < pieces.length; i++) {
    setTimeout(() => {
      if (animation != 'create') {
        pieces[order[i] - 1].style.animationName = 'erase-piece-of-tile';
      } else {
        pieces[order[i] - 1].style.animationName = 'create-piece-of-tile';
      }
      // pieces[order[i] - 1].style.animationDelay = `${animationDuration * i}ms`;
    }, animationDuration * i);
  }
}

// making an order of tiles when loading
// (loading tiles from the upper left corner to the lower right corner)
function makePattern(size) {
  const order = [];

  for (let i = 0; i < size; i++) {
    let initialValue = i + 1;
    for (let k = 0; k <= i; k++) {
      order.push(initialValue);
      initialValue += size - 1;
    }
  }

  for (let i = 2; i <= size; i++) {
    let initialValue = size * i;
    for (let k = 0; k <= size - i; k++) {
      order.push(initialValue);
      initialValue += size - 1;
    }
  }

  return order;
}

// reverses an array
function reverseArray(array) {
  return array.reduce((reversedArray, i) => {
    reversedArray.unshift(i);
    return reversedArray;
  }, []);
}
