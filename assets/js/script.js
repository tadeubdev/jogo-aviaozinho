class Game {
  constructor(canvasId, width, height, clouds, helicopter, floor) {
    this.uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    this.canvas = document.getElementById(canvasId)
    this.width = width
    this.height = height
    this.ctx = this.canvas.getContext('2d')
    this.clouds = clouds;
    this.helicopter = helicopter;
    this.floor = floor;
    this.playing = false;
    this.gameOver = false;
    this.score = new Score(0)
    this.onGameOver = () => {}
    this.onStarting = () => {}
    this.helicopter.onCollission = () => {
      if (!this.playing) {
        return;
      }
      this.playing = false
      this.score.save()
      this.onGameOver()
    }
  }

  mount() {
    this.onReady(this)
    this.draw()
  }

  draw() {
    if (this.gameOver) {
      return;
    }
    this.prepareCanvas()
    this.clouds.forEach(c => c.draw(this.ctx));
    this.floor.draw(this.ctx)
    this.helicopter.draw(this.ctx)
    this.score.draw(this.ctx)
    if (this.playing) {
      this.score.increment()
    }
    requestAnimationFrame(() => this.draw())
  }

  clear() {
    this.playing = false
    this.gameOver = true
    this.clouds.forEach(c => c.clear())
    this.helicopter.clear()
    this.floor.clear()
    this.score.clear()
    if (this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.canvas = null
    }
    this.onDestruct(this)
  }

  restart() {
    // delete actual game
    this.clear()
    this.playing = true
    const helicopter = new Helicopter(10, Math.ceil(window.innerHeight / 2), window.innerWidth, window.innerHeight)
    const floor = new Floor()
    helicopter.onMoving = (speedX) => {
      floor.updateCharacterSpeed(speedX)
    }
    const clouds = Clouds.generateClouds(window.innerWidth, window.innerHeight, 5)
    const newGame = new Game('game-center', this.width, this.height, clouds, helicopter, floor)
    newGame.playing = true
    newGame.onGameOver = this.onGameOver
    newGame.onStarting = this.onStarting
    newGame.onReady = this.onReady
    newGame.onDestruct = this.onDestruct
    this.onGameOver = () => {}
    this.onStarting = () => {}
    this.onReady = () => {}
    this.onDestruct = () => {}
    newGame.mount()
    newGame.onStarting()
  }

  redraw(width, height) {
    this.width = width
    this.height = height
    
    this.prepareCanvas()
    this.helicopter.changePosition(10, Math.ceil(height / 2))
    
    this.clouds = Clouds.generateClouds(this.width, this.height, this.clouds.length)
    this.clouds.forEach(c => c.draw(this.ctx));
    this.floor.draw(this.ctx)
    this.helicopter.draw(this.ctx)
  }

  prepareCanvas() {
    if (!this.canvas) {
      return;
    }
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.canvas.style.width = `${this.width}px`
    this.canvas.style.height = `${this.height}px`
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  moveCharacter(direction) {
    if (!this.playing) {
      return;
    }
    this.helicopter.incrementSpeed(direction)
  }

}

const onGameOver = (gameInstance) => {
  console.log('onGameOver')
  document.querySelector('#game-over').classList.add('active');
  document.querySelector('#mobile-controls').classList.remove('active');
  gameInstance.helicopter.stopAudioFlying()
}

const onGameStarting = (gameInstance) => {
  console.log('onGameStarting')
  document.querySelector('#mobile-controls').classList.add('active');
  gameInstance.helicopter.startAudioFlying()
}

const onMoving = (gameInstance, speedX) => {
  gameInstance.floor.updateCharacterSpeed(speedX)
}

const startGame = (gameInstance) => {
  const isMobile = gameInstance.width < 1024
  if (isMobile && document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  }
  document.querySelector('#game-start').classList.remove('active');
  gameInstance.restart()
}

const restartGame = (gameInstance) => {
  document.querySelector('#game-over').classList.remove('active');
  gameInstance.restart()
}

const onKeyDown = (gameInstance, e) => {
  switch (e.key) {
    case 'Enter':
      if (!gameInstance.playing) {
        document.querySelector('#game-start').classList.remove('active');
        document.querySelector('#game-over').classList.remove('active');
        restartGame(gameInstance)
      }
      break;
    case 'ArrowUp':
      gameInstance.moveCharacter('up')
      break;
    case 'ArrowDown':
      gameInstance.moveCharacter('down')
      break;
    case 'ArrowLeft':
      gameInstance.moveCharacter('left')
      break;
    case 'ArrowRight':
      gameInstance.moveCharacter('right')
      break;
  }
}

const onWindowResize = (gameInstance, width, height) => {
  gameInstance.redraw(width, height)
  gameInstance.helicopter.updateCanvas(width, height)
}

const handleOnMobileControlsClick = (gameInstance, e) => {
  const btnElm = e.target.closest('.mobile-control-btn')
  if (!btnElm) {
    return;
  }
  const direction = btnElm.getAttribute('id').split('-')[1];
  gameInstance.moveCharacter(direction)
}

const handleTouch = (gameInstance, e) => {
  const btnElm = e.target.closest('.mobile-control-btn');
  if (!btnElm) {
    return;
  }
  const direction = btnElm.getAttribute('id').split('-')[1];
  gameInstance.moveCharacter(direction);
}

const handleMove = (gameInstance, e) => {
  e.preventDefault(); // Evita a ação padrão (scroll, por exemplo)

  // Obtém as coordenadas do toque
  const touch = e.touches[0];
  const x = touch.clientX;
  const y = touch.clientY;

  // Encontra o elemento sob o dedo
  const elementUnderFinger = document.elementFromPoint(x, y);
  
  if (elementUnderFinger && elementUnderFinger.classList.contains('mobile-control-btn')) {
    const direction = elementUnderFinger.getAttribute('id').split('-')[1];
    gameInstance.moveCharacter(direction);
  }
}

const onFullscreenChange = () => {
  if (document.fullscreenElement) {
    document.querySelector('#btn-fullscreen i').classList.remove('fa-expand');
    document.querySelector('#btn-fullscreen i').classList.add('fa-compress');
  } else {
    document.querySelector('#btn-fullscreen i').classList.remove('fa-compress');
    document.querySelector('#btn-fullscreen i').classList.add('fa-expand');
  }
}

const handleOnToggleFullscreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
}

const clouds = Clouds.generateClouds(window.innerWidth, window.innerHeight, 5)
const helicopter = new Helicopter(10, Math.ceil(window.innerHeight / 2), window.innerWidth, window.innerHeight)
const floor = new Floor()

const game = new Game('game-center', window.innerWidth, window.innerHeight, clouds, helicopter, floor)

game.onReady = (gameInstance) => {
  gameInstance.onGameOver = () => onGameOver(gameInstance);
  gameInstance.onStarting = () => onGameStarting(gameInstance);
  helicopter.onMoving = (speedX) => onMoving(gameInstance, speedX);
  document.querySelector('#btn-start').addEventListener('click', () => startGame(gameInstance));
  document.querySelector('#btn-restart').addEventListener('click', () => restartGame(gameInstance));
  window.addEventListener('keydown', (e) => onKeyDown(gameInstance, e));
  window.addEventListener('resize', () => onWindowResize(gameInstance, window.innerWidth, window.innerHeight));
  // add event to trigger when the user touch the #mobile-controls buttons
  const mobileControls = document.querySelector('#mobile-controls');
  mobileControls.addEventListener('touchstart', (e) => handleTouch(gameInstance, e));
  mobileControls.addEventListener('touchmove', (e) => handleMove(gameInstance, e));
  document.querySelector('#btn-fullscreen').addEventListener('click', handleOnToggleFullscreen);
  document.addEventListener("fullscreenchange", onFullscreenChange);
  onFullscreenChange();
}

game.onDestruct = (gameInstance) => {
  gameInstance.onGameOver = () => {}
  gameInstance.onStarting = () => {}
  helicopter.onMoving = () => {};
  document.querySelector('#btn-start').removeEventListener('click', () => startGame(gameInstance));
  document.querySelector('#btn-restart').removeEventListener('click', () => restartGame(gameInstance));
  window.removeEventListener('keydown', (e) => onKeyDown(gameInstance, e));
  window.removeEventListener('resize', () => onWindowResize(gameInstance, window.innerWidth, window.innerHeight));
  // remove event to trigger when the user touch the #mobile-controls buttons
  const mobileControls = document.querySelector('#mobile-controls');
  mobileControls.removeEventListener('touchstart', (e) => handleTouch(gameInstance, e));
  mobileControls.removeEventListener('touchmove', (e) => handleMove(gameInstance, e));
  document.querySelector('#btn-fullscreen').removeEventListener('click', handleOnToggleFullscreen);
  document.removeEventListener("fullscreenchange", onFullscreenChange);
  onFullscreenChange();
}

game.mount()