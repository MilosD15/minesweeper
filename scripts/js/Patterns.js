
// object that defines tile states
export const TILE_STATES = {
  NUMBER: 'number',
  HIDDEN: 'hidden',
  MINE: 'mine',
  MARKED: 'marked',
  REVEAL_WITHOUT_ANIMATING: 'revealWithoutAnimating'
}

// default tile object
export const tilePattern = {
  id: 0,
  row: 0,
  column: 0,
  isMine: false,
  numberOfMinesAroundMe: 0,
  state: TILE_STATES.HIDDEN
};

// object that defines game states
export const GAME_STATES = {
  IN_PROGRESS: Symbol('inProgress'),
  ENDED: Symbol('ended')
};

// animation speeds
export const ANIMATION_SPEEDS = {
  FAST: 15,
  SLOW: 40
};