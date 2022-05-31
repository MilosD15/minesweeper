

// DOM elements
const board = document.querySelector('[data-board]');
const minesLeftLabel = document.querySelector('[data-remaining-mines]');
const tileTemplate = document.querySelector('#tile-template');
const root = document.querySelector(':root');
const controlsContainer = document.querySelector(".controls-container");
const victoryContainer = document.querySelector('.victory-container-wrapper');
const openCustomizeMenuVictoryButton = document.querySelector('.victory-container-wrapper .open-customize-menu-button-container > button');
const defeatContainer = document.querySelector('.defeat-container-wrapper');
const resetGameDefeatButton = document.querySelector('.defeat-container-wrapper .reset-button-container > button');

// renders individual tile on a page
export function renderTile(tile, animation) {
  const fragment = tileTemplate.content.cloneNode(true);

  const container = fragment.querySelector('[data-tile]');
  container.dataset.tileId = tile.id;

  const tileText = fragment.querySelector('[data-text]');
  const mines = tile.numberOfMinesAroundMe;
  tileText.textContent = mines;
  // don't appear the number of mines if it's 0
  if (mines == 0) tileText.style.color = 'transparent';

  const tileState = fragment.querySelector('[data-state]');
  for (let i = 0; i < 16 ; i++) {
    const div = document.createElement("div");
    tileState.appendChild(div);
  }
  tileState.dataset.state = tile.state;

  if (!animation.isAnimate) {
    tileState.dataset.animation = 'false';
  }

  if (!animation.isAnimate) {
    const pieces = fragment.querySelectorAll('[data-state] > div');
    pieces.forEach(piece => piece.remove());
  }

  board.appendChild(container);
}

// updates css variable --size
export function applySize(size) {
  root.style.setProperty('--size', `${size}`);
}

// update number of mine left
export function updateMinesLeft(minesLeft) {
  minesLeftLabel.textContent = `Mines left: ${minesLeft}`;
}

// applies state of tile
export function applyState(tile) {
  const container = board.querySelector(`[data-tile-id="${tile.id}"`);
  const blanket = container.querySelector('[data-state]');
  blanket.dataset.state = tile.state;
}

// keeps the width of the board and width of the container for remaining mines be the same
export function checkBoardWidth() {
  const boardWidth = board.offsetWidth;
  controlsContainer.style.width = `${boardWidth}px`;
}

// opens victory box when user win
export function openVictoryBox() {
  victoryContainer.dataset.state = 'active';
  setTimeout(() => {
    openCustomizeMenuVictoryButton.dataset.clickable = 'true';
  }, 3800);
}

// opens defeat box when user lose
export function openDefeatBox() {
  defeatContainer.dataset.state = 'active';
  setTimeout(() => {
    resetGameDefeatButton.dataset.clickable = 'true';
  }, 1300);
}