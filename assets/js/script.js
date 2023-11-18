class Game {
  constructor(canvasId, width, height, clouds, helicopter, floor, profile) {
    this.uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    this.canvas = document.getElementById(canvasId)
    this.width = width
    this.height = height
    this.ctx = this.canvas.getContext('2d')
    this.clouds = clouds;
    this.helicopter = helicopter;
    this.profile = profile;
    this.floor = floor;
    this.playing = false;
    this.gameOver = false;
    this.score = new Score(0)
    this.shoots = []
    this.onGameOver = () => {}
    this.onStarting = () => {}
    this.helicopter.onCollission = () => {
      if (!this.playing) {
        return;
      }
      if (this.profile.isAlive()) {
        this.profile.decrement()
        this.score.decrement(100)
        this.helicopter.resetPosition()
        return;
      }
      this.profile.decrement()
      this.helicopter.stopAudioFlying()
      this.playing = false
      this.score.save()
      this.onGameOver()
    }
    this.helicopter.onShoot = (x, y) => {
      if (!this.playing) {
        return;
      }
      this.dispatchShoot(x, y);
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
    this.profile.draw(this.ctx)
    if (this.playing) {
      this.score.increment()
      this.shoots.forEach(s => s.draw(this.ctx))
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
    const helicopter = new Helicopter(10, Math.ceil(this.height / 2), this.width, this.height)
    const floor = new Floor()
    const clouds = Clouds.generateClouds(this.width, this.height, 5)
    const profile = new Profile()
    const newGame = new Game('game-center', this.width, this.height, clouds, helicopter, floor, profile)
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

  dispatchShoot(x, y) {
    const shoot = new Shoot(x, y, this.width)
    shoot.onFinish = () => {
      this.shoots = this.shoots.filter(s => s.uuid !== shoot.uuid)
    }
    this.shoots.push(shoot);
    shoot.draw(this.ctx)
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
  gameInstance.clouds.map(c => c.updateCharacterSpeed(speedX))
}

const startGame = (gameInstance) => {
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
    case ' ':
      gameInstance.helicopter.shoot()
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

const gameWidth = window.innerWidth
const gameHeight = window.innerHeight

const clouds = Clouds.generateClouds(gameWidth, gameHeight, 5)
const helicopter = new Helicopter(10, Math.ceil(gameHeight / 2), gameWidth, gameHeight)
const floor = new Floor()
const profile = new Profile()

const game = new Game('game-center', gameWidth, gameHeight, clouds, helicopter, floor, profile)

setTimeout(() => {
  document.querySelector('#game-start').classList.remove('active');
  document.querySelector('#game-over').classList.remove('active');
  restartGame(game)
}, 200);

game.onReady = (gameInstance) => {
  gameInstance.onGameOver = () => onGameOver(gameInstance);
  gameInstance.onStarting = () => onGameStarting(gameInstance);
  gameInstance.helicopter.onMoving = (speedX) => onMoving(gameInstance, speedX);
  document.querySelector('#btn-start').addEventListener('click', () => startGame(gameInstance));
  document.querySelector('#btn-restart').addEventListener('click', () => restartGame(gameInstance));
  window.addEventListener('keydown', (e) => onKeyDown(gameInstance, e));
  window.addEventListener('resize', () => onWindowResize(gameInstance, gameWidth, gameHeight));
  // add event to trigger when the user touch the #mobile-controls buttons
  const mobileControls = document.querySelector('#mobile-controls');
  mobileControls.addEventListener('touchstart', (e) => handleTouch(gameInstance, e));
  mobileControls.addEventListener('touchmove', (e) => handleMove(gameInstance, e));
}

game.onDestruct = (gameInstance) => {
  gameInstance.onGameOver = () => {}
  gameInstance.onStarting = () => {}
  gameInstance.helicopter.onMoving = () => {};
  document.querySelector('#btn-start').removeEventListener('click', () => startGame(gameInstance));
  document.querySelector('#btn-restart').removeEventListener('click', () => restartGame(gameInstance));
  window.removeEventListener('keydown', (e) => onKeyDown(gameInstance, e));
  window.removeEventListener('resize', () => onWindowResize(gameInstance, gameWidth, gameHeight));
  // remove event to trigger when the user touch the #mobile-controls buttons
  const mobileControls = document.querySelector('#mobile-controls');
  mobileControls.removeEventListener('touchstart', (e) => handleTouch(gameInstance, e));
  mobileControls.removeEventListener('touchmove', (e) => handleMove(gameInstance, e));
}

game.mount()