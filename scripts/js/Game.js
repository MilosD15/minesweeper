
// imports
import { TILE_STATES } from './Patterns.js';
import { applyState } from './DOM&CSSManipulations.js';
import { findTile } from './CreateTiles.js';

// DOM elements
const board = document.querySelector('[data-board]');

// checks if the game is won or not
export function isWon(tiles) {
  const nonMines = tiles.filter(tile => !tile.isMine);
  const firstOption = nonMines.every(tile => tile.state === TILE_STATES.NUMBER);

  const mines = tiles.filter(tile => tile.isMine);
  const secondOption = mines.every(tile => tile.state === TILE_STATES.MARKED);

  return firstOption || secondOption;
}

// reveals all tiles
export function revealTiles(tiles) {
  tiles.forEach(tile => {
    if (tile.isMine) {
      if (tile.state != TILE_STATES.MARKED) {
        tile.state = TILE_STATES.MINE;
        const tileElement = board.querySelector(`[data-tile-id="${tile.id}"]`);
        const pieces = tileElement.querySelectorAll('[data-state] > div');
        pieces.forEach(piece => piece.remove());
      }
        applyState(tile);
    } else {
      tile.state = TILE_STATES.REVEAL_WITHOUT_ANIMATING;
    }
    applyState(tile);
  });
}

export function revealEmptyTilesWithoutAnimatingTiles(tile, size) {
  const emptyTiles = determineEmptyTilesAroundTile(tile, size);
  if (emptyTiles.length == 0) return;
  emptyTiles.forEach(({tile}) => {
    if (tile.state === TILE_STATES.NUMBER) return;
    tile.state = TILE_STATES.NUMBER;
    applyState(tile);
    revealEmptyTilesWithoutAnimatingTiles(tile, size);
  });
}

// returns an array of empty tiles around specific tile
export function determineEmptyTilesAroundTile(tile, size) {
  const [row, column] = [tile.row, tile.column];
  const directionMap = new Map([
    [`${row - 1}-${column - 1}`, 'bottomRightToTopLeft'],
    [`${row - 1}-${column}`, 'bottomToTop'],
    [`${row - 1}-${column + 1}`, 'bottomLeftToTopRight'],
    [`${row}-${column + 1}`, 'leftToRight'],
    [`${row}-${column - 1}`, 'rightToLeft'],
    [`${row + 1}-${column + 1}`, 'topLeftToBottomRight'],
    [`${row + 1}-${column}`, 'topToBottom'],
    [`${row + 1}-${column - 1}`, 'topRightToBottomLeft']
  ]);
  // console.log(directionMap.get({i: row, k: column}))
  let emptyTiles = [];
  for (let i = row - 1; i <= row + 1; i++) {
    for (let k = column - 1; k <= column + 1; k++) {
      if (i == 0 && k == 0) continue;
      const potentialEmptyTile = findTile(i, k, size);
      if (potentialEmptyTile == null) continue;
      if (potentialEmptyTile.numberOfMinesAroundMe == 0) {
        emptyTiles.push({
          tile: potentialEmptyTile,
          direction: directionMap.get(`${i}-${k}`)
        });
      }
    }
  }
  return emptyTiles;
}
