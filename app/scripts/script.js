// imports
import createTiles from './js/CreateTiles.js';
import {
  applySize,
  applyState,
  updateMinesLeft,
  renderTile,
  checkBoardWidth,
  openVictoryBox,
  openDefeatBox
} from './js/DOM&CSSManipulations.js';
import { TILE_STATES, GAME_STATES, ANIMATION_SPEEDS } from './js/Patterns.js';
import {
  revealTiles,
  revealEmptyTilesWithoutAnimatingTiles,
  isWon
} from './js/Game.js';
import {
  revealEmptyTiles,
  animateTiles,
  animateTile
} from './js/Animations.js';
import { isMobilePhoneOrTablet } from './js/AdditionalFunctions.js';

// global variables
let size = 12;
let numberOfMines = 12;
let minesLeft = numberOfMines;
let tiles = [];
let gameState = GAME_STATES.IN_PROGRESS;
const animation = {
  isAnimate: true,
  speed: ANIMATION_SPEEDS.FAST
};
let markedMinesColor = 'yellow';
let minesImage = 'explosion';

//                Handling header and customize window buttons

// DOM elements
const darkLightThemeContainer = document.querySelector('.dark-light-theme');
const menuButton = document.querySelector('.menu-icon > svg');
const menu = menuButton.closest('.menu');
const customizeButtonInMenu = document.querySelector(
  '.menu-content .option:nth-child(1)'
);
const rulesButtonInMenu = document.querySelector(
  '.menu-content .option:nth-child(2)'
);
const customizeContainer = document.querySelector('.customize-container');
const rulesContainer = document.querySelector('.rules-container');
const closeCustomizeWindowButton = document.querySelector(
  '.customize-container .times'
);
const closeRulesWindowButton = document.querySelector(
  '.rules-container .times'
);
const toggleAnimationsButton = document.querySelector(
  '.animations-container .row'
);
const toggleAnimationsContainer = document.querySelector(
  '.animations-and-appearance > .row[data-disabled]'
);
const animationsButton = document.querySelector(
  '.animations-container .animations-button'
);
const BoardSizesOptions = document.querySelectorAll(
  '.board-sizes .dimensions .option .wrapper'
);
const difficultyLevelOptions = document.querySelectorAll(
  '.levels .level input'
);
const speedOptions = document.querySelectorAll('.speed-options .option input');
const MarkedMinesColorOptions = document.querySelectorAll(
  '.color-palette .color'
);
const minesImagesOptions = document.querySelectorAll('.mines-pictures .image');
const applyChangesButton = document.querySelector(
  '.apply-button-container button'
);
const board = document.querySelector('[data-board]');
const resetButton = document.querySelector('[data-reset]');
const minesLeftLabel = document.querySelector('[data-remaining-mines]');
const toggleSoundButton = document.querySelector('[data-toggle-sound]');
const toggleSoundButtonTooltip = document.querySelector(
  '[data-toggle-sound] .tooltip'
);
const victoryContainer = document.querySelector('.victory-container-wrapper');
const openCustomizeMenuVictoryButton = document.querySelector(
  '.victory-container-wrapper .open-customize-menu-button-container > button'
);
const defeatContainer = document.querySelector('.defeat-container-wrapper');
const resetGameDefeatButton = document.querySelector(
  '.defeat-container-wrapper .reset-button-container > button'
);
const resourcesTrack = document.querySelector('.credits-container .track');
const getStartedButton = document.querySelector('[data-get-started]');
const loader = document.querySelector('#loader');


//                            Sounds
// sounds on the page
const backgroundMusic = document.querySelector('[data-background-music]');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;
const applauseSound = document.querySelector('[data-applause-sound-effect]');
applauseSound.volume = 0.5;
const explosionSound = document.querySelector('[data-explosion-sound-effect]');
explosionSound.volume = 0.5;
const openMenuSound = document.querySelector('[data-open-menu-sound-effect]');
openMenuSound.volume = 0.5;
// sounds for loading animation (animation at the beginning)
const preExplosionSound = document.querySelector('[data-pre-bomb-explosion-sound-effect]');
preExplosionSound.loop = true;
preExplosionSound.volume = 0.3;
const loaderExplosionSound = document.querySelector('[data-loader-explosion-sound-effect]');
loaderExplosionSound.volume = 0.6;

// determines whether music is turned off or turned on
let music = true;

// document.onclick = () => {
//   console.log(size, numberOfMines, markedMinesColor, minesImage, animation)
// }

// checks the width of the device and according to that disables/enables certain properties on the page
const checkWidthForRenderingProperties = () => {
  const width = window.innerWidth;
  if (width > 550) {
    toggleAnimationsContainer.dataset.disabled = 'false';
    if (animation.isAnimate) {
      animationsButton.classList.add('on');
    }
    enableBoardSize(9);
    enableBoardSize(12);
  }
  if (width <= 550 && width > 420) {
    disableAnimationsInHTML();
    enableBoardSize(9);
    enableBoardSize(12);
    // resetGame();
  }
  if (width <= 420 && width > 340) {
    disableAnimationsInHTML();
    enableBoardSize(9);
    if (size == 12) {
      // size = 9;
      setActiveClassForCurrentBoardSize(9);
    }
    disableBoardSize(12);
  }
  if (width <= 340) {
    disableAnimationsInHTML();
    if (size == 12 || size == 9) {
      // size = 6;
      setActiveClassForCurrentBoardSize(6);
    }
    disableBoardSize(9);
    disableBoardSize(12);
  }
};

// rendering proper properties according to the page width
// window.onload = () => {
//   checkWidthForRenderingProperties();
// };

// window.onresize = () => {
//   checkWidthForRenderingProperties();
// };

// disabling and enabling specific board size option
function disableBoardSize(size) {
  const targetBoardSizeElement = document.querySelector(
    `.board-sizes .dimensions .option[data-size="${size}"]`
  );
  targetBoardSizeElement.dataset.disabled = 'true';
}

function enableBoardSize(size) {
  const targetBoardSizeElement = document.querySelector(
    `.board-sizes .dimensions .option[data-size="${size}"]`
  );
  targetBoardSizeElement.dataset.disabled = 'false';
}

// disabling and enabling animation section
function disableAnimationsInHTML() {
  toggleAnimationsContainer.dataset.disabled = 'true';
  animationsButton.classList.remove('on');
}

// function enableAnimationsInHTML() {
//   toggleAnimationsContainer.dataset.disabled = 'false';
//   animationsButton.classList.add('on');
// }

// calculates possible numbers of mines and renders them on the screen
const calculatePossibleNumberOfMines = () => {
  // calculating number of mines for each level
  const options = new Map([
    ['beginner', size],
    ['intermediate', Math.ceil(size + size / 2)],
    ['expert', size * 2]
  ]);
  // setting number of mines
  numberOfMines = options.get('beginner');
  difficultyLevelOptions.forEach(option => {
    // setting number of mines in data- attribute
    option.dataset.mines = options.get(option.value);
    // selecting and rendering/changing HTML
    const levelElement = option.closest('.level');
    const textElement = levelElement.querySelector('.number-of-mines');
    textElement.innerHTML = `&nbsp;&nbsp;-&nbsp;&nbsp;${options.get(
      option.value
    )}&nbsp;`;
  });
  // setting the first option as default (beginner level)
  difficultyLevelOptions[0].checked = true;
};

// initial calculating possible number of mines
calculatePossibleNumberOfMines();

// changing size of the game board
BoardSizesOptions.forEach(option => {
  option.addEventListener('click', e => {
    // playing menu sound
    if (music) {
      openMenuSound.currentTime = 0;
      openMenuSound.play();
    }

    const optionElement = e.target.closest('.option');
    // setting new size
    if (optionElement.dataset.disabled == 'true') return;
    size = parseInt(optionElement.dataset.size);
    // calculating new options connected to the number of mines
    calculatePossibleNumberOfMines();
    setActiveClassForCurrentBoardSize(size);
  });
});

function setActiveClassForCurrentBoardSize(size) {
  const targetBoardSizeElement = document.querySelector(
    `.board-sizes .dimensions .option[data-size="${size}"]`
  );
  // adding active class to clicked option
  targetBoardSizeElement.classList.add('active');
  // removing active class from other options
  BoardSizesOptions.forEach(option => {
    const optionElement = option.closest('.option');
    if (optionElement.dataset.size != size) {
      optionElement.classList.remove('active');
    }
  });
}

// changing number of mines on the game board
difficultyLevelOptions.forEach(option => {
  const levelElement = option.closest('.level');
  levelElement.addEventListener('click', e => {
    // playing menu sound
    if (music) {
      openMenuSound.currentTime = 0;
      openMenuSound.play();
    }

    if (e.target.matches('input')) {
      numberOfMines = parseInt(e.target.dataset.mines);
    }
  });
});

// changing animation speed on the game board
speedOptions.forEach(option => {
  const speedOptionElement = option.closest('.option');
  speedOptionElement.addEventListener('click', e => {
    // playing menu sound
    if (music) {
      openMenuSound.currentTime = 0;
      openMenuSound.play();
    }

    if (e.target.matches('input')) {
      animation.speed =
        e.target.value == 'fast-speed'
          ? ANIMATION_SPEEDS.FAST
          : ANIMATION_SPEEDS.SLOW;
    }
  });
});

// renders the right image for the board-size menu according to the color theme
const renderProperBoardSizeMenuImage = () => {
  const boardSizeImage12x12Element = document.querySelector(
    '.board-sizes .dimensions .option:nth-child(1) .image img'
  );
  const boardSizeImage9x9Element = document.querySelector(
    '.board-sizes .dimensions .option:nth-child(2) .image img'
  );
  const boardSizeImage6x6Element = document.querySelector(
    '.board-sizes .dimensions .option:nth-child(3) .image img'
  );

  if (document.body.classList.contains('light')) {
    boardSizeImage12x12Element.src = './12x12-board-lighter.PNG';
    boardSizeImage9x9Element.src = './9x9-board-lighter.PNG';
    boardSizeImage6x6Element.src = './6x6-board-lighter.PNG';
  } else {
    boardSizeImage12x12Element.src = './12x12-board.f79af9fa.PNG';
    boardSizeImage9x9Element.src = './9x9-board.4b85b78f.PNG';
    boardSizeImage6x6Element.src = './6x6-board.f4e21d01.PNG';
  }
};

// changes the overall color theme of the webpage according to body class
const checkTheme = () => {
  const root = document.querySelector(':root');
  if (document.body.classList.contains('light')) {
    root.style.setProperty('color-scheme', 'light');
  } else {
    root.style.setProperty('color-scheme', 'dark');
  }
};

// toggle dark-light mode
darkLightThemeContainer.addEventListener('click', () => {
  // playing menu sound
  if (music) {
    openMenuSound.currentTime = 0;
    openMenuSound.play();
  }

  document.body.classList.toggle('light');
  renderProperBoardSizeMenuImage();
  checkTheme();
});

// open/close menu
menuButton.addEventListener('click', () => {
  // playing menu sound
  if (music) {
    openMenuSound.currentTime = 0;
    openMenuSound.play();
  }

  menu.classList.toggle('open');
});

// closing menu if it's clicked outside of the menu
document.addEventListener('click', e => {
  if (e.target.closest('.menu')) return;
  menu.classList.remove('open');
});

const openCustomizeMenu = () => {
  customizeContainer.classList.add('active');
  customizeContainer.scrollTop = 0;
  // document.body.style.overflowY = 'auto';
  menu.classList.remove('open');
  rulesContainer.classList.remove('active');
  // preserves weird behaviors on the page (e.g. moving header section)
  setTimeout(() => {
    rulesContainer.style.position = 'fixed';
  }, 0);
};

// open customize window
customizeButtonInMenu.addEventListener('click', () => {
  // playing menu sound
  if (music) {
    openMenuSound.currentTime = 0;
    openMenuSound.play();
  }

  openCustomizeMenu();
});

const closeCustomizeMenu = () => {
  customizeContainer.classList.remove('active');
}

// close customize window
closeCustomizeWindowButton.addEventListener('click', () => {
  // playing menu sound
  if (music) {
    openMenuSound.currentTime = 0;
    openMenuSound.play();
  }

  closeCustomizeMenu();
});

const openRulesContainer = () => {
  rulesContainer.classList.add('active');
  rulesContainer.scrollTop = 0;
  // preserves weird behaviors on the page (e.g. moving header section)
  setTimeout(() => {
    rulesContainer.style.position = 'absolute';
  }, 400);

  menu.classList.remove('open');
  customizeContainer.classList.remove('active');
}

// open rules window
rulesButtonInMenu.addEventListener('click', () => {
  // playing menu sound
  if (music) {
    openMenuSound.currentTime = 0;
    openMenuSound.play();
  }

  openRulesContainer();
});

const closeRulesWindow = () => {
  rulesContainer.classList.remove('active');
  // preserves weird behaviors on the page (e.g. moving header section)
  setTimeout(() => {
    rulesContainer.style.position = 'fixed';
  }, 0);
}

// close rules window
closeRulesWindowButton.addEventListener('click', () => {
  // playing menu sound
  if (music) {
    openMenuSound.currentTime = 0;
    openMenuSound.play();
  }

  closeRulesWindow();
});

const toggleAnimations = () => {
  if (toggleAnimationsContainer.dataset.disabled == 'true') return;
  animation.isAnimate = animation.isAnimate == false ? true : false;
  animationsButton.classList.toggle('on');
}

// switching on/off the animations on the game board
toggleAnimationsButton.addEventListener('click', () => {
  // playing menu sound
  if (music) {
    openMenuSound.currentTime = 0;
    openMenuSound.play();
  }

  toggleAnimations();
});

// switching to another color of marked mines
MarkedMinesColorOptions.forEach(option => {
  option.addEventListener('click', e => {
    // playing menu sound
    if (music) {
      openMenuSound.currentTime = 0;
      openMenuSound.play();
    }

    // setting new color of marked mines
    markedMinesColor = e.target.dataset.color;
    // removing active class from every other color option element
    MarkedMinesColorOptions.forEach(option =>
      option.classList.remove('active')
    );
    // adding active class to the target element
    e.target.classList.add('active');
    // applies new marked mines color on board
    updateMarkedMineColorOnBoard();
  });
});

// switching to another image of mines
minesImagesOptions.forEach(option => {
  option.addEventListener('click', e => {
    // playing menu sound
    if (music) {
      openMenuSound.currentTime = 0;
      openMenuSound.play();
    }

    // setting new mine image
    const targetImageOption = e.target.closest('.image');
    minesImage = targetImageOption.dataset.mineImage;
    // removing active class from every other mines image option
    minesImagesOptions.forEach(option => option.classList.remove('active'));
    // adding active class to the target mines image option
    targetImageOption.classList.add('active');
    // applies new mine image on board
    updateMinesImageOnBoard();
  });
});

// switching on/off sounds
toggleSoundButton.addEventListener('click', () => {
  const state = toggleSoundButton.dataset.toggleSound;
  if (state == 'sound-off') {
    music = true;
    backgroundMusic.play();
    toggleSoundButton.dataset.toggleSound = 'sound-on';
    toggleSoundButtonTooltip.textContent = 'Enable sounds';
  } else {
    // playing menu sound
    if (music) {
      openMenuSound.currentTime = 0;
      openMenuSound.play();
    }

    music = false;
    backgroundMusic.pause();
    toggleSoundButton.dataset.toggleSound = 'sound-off';
    toggleSoundButtonTooltip.textContent = 'Disable sounds';
  }
});

applyChangesButton.addEventListener('click', () => {
  // playing menu sound
  if (music) {
    openMenuSound.currentTime = 0;
    openMenuSound.play();
  }

  resetGame();
  checkBoardWidth();
  customizeContainer.classList.remove('active');
});

function updateMarkedMineColorOnBoard() {
  board.dataset.markedMinesColor = markedMinesColor;
}

function updateMinesImageOnBoard() {
  board.classList.value = minesImage;
}

resourcesTrack.addEventListener('click', () => {
  const parent = resourcesTrack.closest('.credits-container');
  if (parent.dataset.opened == 'true')
    parent.dataset.opened = ''
  else
  parent.dataset.opened = 'true'
});

// animation that triggers when you click on a 'Start game...' button at the beginning
getStartedButton.addEventListener('click', () => {
  loader.dataset.loadingState = 'started';
  getStartedButton.style.pointerEvents = 'none';
  setTimeout(() => {
    preExplosionSound.play();
  }, 1000);
  setTimeout(() => {
    preExplosionSound.pause();
    loaderExplosionSound.play();
    document.querySelector('#loader .bomb img').style.opacity = 0;
    // creating and rendering tiles when the loading animation is up to finish
    resetGame();
    checkBoardWidth();
  }, 2700);
  setTimeout(() => {
    backgroundMusic.play();
  }, 4200);
  setTimeout(() => {
    loaderExplosionSound.pause();
  }, 4500)
});





















//                Game (events, functions, and so on...)

// checks if board should be frozen or not (just if animations are turned on)
const freezeBoard = {
  isFrozen: false,
  durationOfFreezing: 0
};
// saves when the touchstart and touchend events occur
let startDate, endDate;

// reset all global variables to initial values and restart game
function resetGame() {
  // resetting global variables
  minesLeft = numberOfMines;
  gameState = GAME_STATES.IN_PROGRESS;
  // erasing tiles
  board.innerHTML = '';
  updateMinesLeft(minesLeft);
  // recreating and rerendering tiles
  tiles = createTiles(size, numberOfMines);
  tiles.forEach(tile => renderTile(tile, animation));
  // tiles.forEach(setBlanketDimensions);
  if (animation.isAnimate) {
    animateTiles(size, animation.speed);
    freezeBoard.isFrozen = true;
    freezeBoard.durationOfFreezing = size * (animation.speed ^ 2) * 16;
    stopFreezing();
  }
}

// stops freezing of the board after specified delay
function stopFreezing() {
  setTimeout(() => {
    freezeBoard.isFrozen = false;
  }, freezeBoard.durationOfFreezing);
}

// EVENT LISTENERS AND ADDITIONAL FUNCTIONS CONNECTED TO THEM

// window and document events
window.addEventListener('resize', () => {
  checkWidthForRenderingProperties();
  checkWidthForAnimationsAndBoard();
  checkBoardWidth();
});
window.onload = () => {
  // get started button animation
  setTimeout(() => {
    getStartedButton.style.animationName = 'fade-in';
    getStartedButton.style.pointerEvents = 'initial';
  }, 500);
  // rendering certain properties according to the device width
  checkWidthForRenderingProperties();
  checkWidthForAnimationsAndBoard();
};
// disabling context menu
document.oncontextmenu = () => false;

// reset button is clicked
resetButton.addEventListener('click', () => {
  // playing menu sound
  if (music) {
    openMenuSound.currentTime = 0;
    openMenuSound.play();
  }

  resetGame();
});

// checks a device's width and sets allowed size of the board
function checkWidthForAnimationsAndBoard() {
  const width = window.innerWidth;
  if (width <= 550 && width > 420 && animation.isAnimate) {
    animation.isAnimate = false;
    resetGame();
  }
  if (width <= 420 && width > 340 && size == 12) {
    animation.isAnimate = false;
    size = 9;
    calculatePossibleNumberOfMines();
    applySize(size);
    resetGame();
  }
  if (width <= 340 && size != 6) {
    animation.isAnimate = false;
    size = 6;
    calculatePossibleNumberOfMines();
    applySize(size);
    resetGame();
  }
}

document.addEventListener('keydown', HandleShortcuts);

function HandleShortcuts(e) {
  // Alt + R -> restarts the game
  if (e.altKey == true && e.code == 'KeyR') {
    resetGame();
    checkBoardWidth();
    // closes rules container
    closeRulesWindow();
    // closes customize container
    closeCustomizeMenu();
  }
  // Alt + I -> opens rules container
  if (e.altKey == true && e.code == 'KeyI') {
    if (!rulesContainer.classList.contains('active'))
      openRulesContainer();
  }
  // Alt + C -> opens customize container
  if (e.altKey == true && e.code == 'KeyC') {
    if (!customizeContainer.classList.contains('active'))
      openCustomizeMenu();
  }
  // Alt + A -> toggles board animations
  if (e.altKey == true && e.code == 'KeyA') {
    toggleAnimations();
  }
}

// event listeners for each tile (computers)
document.addEventListener('mousedown', e => {
  if (isMobilePhoneOrTablet()) return;
  if (e.target.closest('[data-state]') == undefined || e.target.closest('[data-state]') == null) return;

  // console.log(e)

  const dataStateElement = e.target.closest('[data-state]');

  HandleClickOnATile(dataStateElement, { button: e.button });
});

// event listeners for each tile (mobile phones and tablets)
document.addEventListener('touchstart', e => {
  if (e.target.closest('[data-state]') == undefined) return;

  startDate = new Date(e.timeStamp);
});

document.addEventListener('touchend', e => {
  if (e.target.closest('[data-state]') == undefined) return;
  const dataStateElement = e.target.closest('[data-state]');

  endDate = new Date(e.timeStamp);
  const durationOfTheTouch = new Date(
    endDate.getTime() - startDate.getTime()
  ).getMilliseconds();

  HandleClickOnATile(dataStateElement, {
    durationOfTheTouch: durationOfTheTouch
  });
});

// handles when user clicked on a tile
function HandleClickOnATile(
  dataStateElement,
  { button = 1, durationOfTheTouch = -1 }
) {
  // checks if game board is frozen or not
  if (freezeBoard.isFrozen) return;

  // console.log(durationOfTheTouch, button)

  // checks if game is ended or not
  if (gameState == GAME_STATES.ENDED) return;

  const parent = dataStateElement.closest('[data-tile]');
  const id = parseInt(parent.dataset.tileId);
  const tile = tiles.find(tile => tile.id == id);

  // user clicked on the left mouse button or just tapped on a screen
  if (button == 0 || (durationOfTheTouch < 300 && durationOfTheTouch > 0)) {
    if (tile.isMine) {
      gameState = GAME_STATES.ENDED;
      minesLeftLabel.textContent = '';
      revealTiles(tiles);
      if (music) {
        explosionSound.play();
        explosionSound.currentTime = 0;
      }
      openDefeatBox();
    } else {
      if (tile.state == TILE_STATES.MARKED) {
        minesLeft++;
        updateMinesLeft(minesLeft);
      }
      if (tile.numberOfMinesAroundMe == 0) {
        if (!animation.isAnimate) {
          revealEmptyTilesWithoutAnimatingTiles(tile, size);
        } else {
          revealEmptyTiles(tile, size, animation);
        }
      } else {
        tile.state = TILE_STATES.NUMBER;
        applyState(tile);
        if (animation.isAnimate) {
          const tileElement = board.querySelector(`[data-tile-id="${tile.id}"`);
          animateTile(tileElement, animation.speed, undefined, 'erase');
        }
      }
    }
  }

  // user clicks on the right mouse button or tapped on a screen and held it for a second or more
  if (button == 2 || durationOfTheTouch >= 300) {
    if (minesLeft == 0 && tile.state !== TILE_STATES.MARKED) return;
    if (tile.state !== TILE_STATES.HIDDEN && tile.state !== TILE_STATES.MARKED)
      return;
    tile.state =
      tile.state === TILE_STATES.MARKED
        ? TILE_STATES.HIDDEN
        : TILE_STATES.MARKED;
    applyState(tile);
    minesLeft =
      tile.state === TILE_STATES.HIDDEN ? minesLeft + 1 : minesLeft - 1;
    updateMinesLeft(minesLeft);
  }

  // checks if the player is won or not
  if (gameState !== GAME_STATES.ENDED && isWon(tiles)) {
    gameState = GAME_STATES.ENDED;
    minesLeftLabel.textContent = '';
    revealTiles(tiles);
    if (music) {
      applauseSound.play();
      applauseSound.currentTime = 0;
    }
    openVictoryBox();
  }
}

// adds event listener to the button inside victory box
openCustomizeMenuVictoryButton.addEventListener('click', closeVictoryBox);

// adds event listener to the button inside defeat box
resetGameDefeatButton.addEventListener('click', closeDefeatBox);

// closes victory box
function closeVictoryBox() {
  victoryContainer.dataset.state = 'hidden';
  openCustomizeMenu();
  applauseSound.pause();
}

// closes defeat box
function closeDefeatBox() {
  if (music) {
    openMenuSound.currentTime = 0;
    openMenuSound.play();
  }
  defeatContainer.dataset.state = 'hidden';
  resetGame();
  explosionSound.pause();
}
