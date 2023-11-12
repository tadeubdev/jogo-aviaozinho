class Helicopter {
  constructor(x, y, canvasWidth, canvasHeight) {
    this.width = 65
    this.height = 35
    this.x = x
    this.y = y
    this.collided = false
    this.maxAcceleration = 5
    this.acceleration = { x: 0, y: 0 }
    this.velocity = { x: 0, y: 0 }
    this.angle = 0; // Inicializa o ângulo de rotação
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.image = new Image();
    this.image.src = './assets/img/helicopter.png';
    this.onMoving = () => {}
    this.onCollission = () => {}
  }

  clear() {
    this.collided = false
    this.acceleration = { x: 0, y: 0 }
    this.velocity = { x: 0, y: 0 }
    this.angle = 0; // Inicializa o ângulo de rotação
    this.x = 10
    this.y = Math.ceil(this.canvasHeight / 2)
  }

  updateCanvas(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
  }

  isCollided() {
    return this.collided
  }

  draw(ctx) {
    // Atualizar velocidade com base na aceleração
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;

    // Limitar a velocidade máxima
    this.velocity.x = Math.max(Math.min(this.velocity.x, this.maxAcceleration), -this.maxAcceleration);
    this.velocity.y = Math.max(Math.min(this.velocity.y, this.maxAcceleration), -this.maxAcceleration);

    // Atualizar posição com base na velocidade
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    if (this.velocity.x || this.velocity.y) {
      this.onMoving(this.velocity.x, this.velocity.y)
    }

    // Desenhar helicóptero
    if (this.image.complete) {
      // Atualizar ângulo de rotação com base na velocidade
      this.updateAngle();

      // Salvar o estado atual do contexto
      ctx.save();

      // Mover o contexto para o centro do helicóptero
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

      // Rotacionar o contexto
      ctx.rotate(this.angle);

      // Desenhar helicóptero com rotação
      ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);

      // Restaurar o contexto para o estado original
      ctx.restore();
    }

    // Verificar colisão
    this.checkCollision();

    // Reduzir gradualmente a aceleração
    this.reduceAcceleration();

    // Reduzir gradualmente a velocidade
    this.reduceVelocity();

    // Mover o helicóptero para o chão se colidir
    this.moveToFloorWhenCollision()
  }

  updateAngle() {
    if (this.collided) {
      this.angle = Math.PI / 2 - 0.8;
      return;
    }
    // Atualizar o ângulo baseado na velocidade
    // O fator pode ser ajustado para controlar o grau de inclinação
    const rotationFactor = 0.04;
    this.angle = this.velocity.x * rotationFactor;
  }

  moveToFloorWhenCollision() {
    if (!this.collided) {
      return;
    }
    // if the helicopter is below the floor, move it to the floor with a smooth animation
    const distanceY = this.canvasHeight - this.y - this.height
    const animationSpeed = 0.1
    if (distanceY > 1) {
      this.acceleration.y = Math.min(distanceY * animationSpeed, this.maxAcceleration)
    }
    // if the helicopter is far from the x = 0, move it to the x = 0 with a smooth animation
    const distanceX = this.x
    if (distanceX > (this.width * -1)) {
      this.acceleration.x -= 0.1
    }
  }

  checkCollision() {
    if (this.x + this.width > this.canvasWidth || this.x < 0 ||
        this.y + this.height > this.canvasHeight || this.y < 0) {
      this.collided = true;
      this.onCollission()
    }
  }

  reduceAcceleration() {
    if (Math.abs(this.acceleration.x) > 0.01) {
      this.acceleration.x *= 0.9;
    } else {
      this.acceleration.x = 0;
    }
    if (Math.abs(this.acceleration.y) > 0.01) {
      this.acceleration.y *= 0.9;
    } else {
      this.acceleration.y = 0;
    }
  }

  reduceVelocity() {
    if (this.collided) {
      this.velocity.x = 0;
      this.velocity.y = 0;
      return;
    }
    if (Math.abs(this.velocity.x) > 0.01) {
      this.velocity.x *= 0.95; // Reduzir gradualmente
    } else {
      this.velocity.x = 0;
    }

    if (Math.abs(this.velocity.y) > 0.01) {
      this.velocity.y *= 0.95; // Reduzir gradualmente
    } else {
      this.velocity.y = 0;
    }
  }

  incrementSpeed(direction) {
    if (this.collided) {
      this.acceleration.x = 0;
      this.acceleration.y = 0;
      return;
    }
    const accelerationChange = 0.5; // Ajuste fino da aceleração
    if (direction === 'left') {
      // Se já estiver se movendo para a direita, inverter mais rapidamente
      this.acceleration.x = this.velocity.x > 0 ? 
          -accelerationChange : Math.max(this.acceleration.x - accelerationChange, -this.maxAcceleration);
    }
    if (direction === 'right') {
      // Se já estiver se movendo para a esquerda, inverter mais rapidamente
      this.acceleration.x = this.velocity.x < 0 ? 
          accelerationChange : Math.min(this.acceleration.x + accelerationChange, this.maxAcceleration);
    }
    if (direction === 'up') {
      // Se já estiver se movendo para baixo, inverter mais rapidamente
      this.acceleration.y = this.velocity.y > 0 ? 
          -accelerationChange : Math.max(this.acceleration.y - accelerationChange, -this.maxAcceleration);
    }
    if (direction === 'down') {
      // Se já estiver se movendo para cima, inverter mais rapidamente
      this.acceleration.y = this.velocity.y < 0 ? 
          accelerationChange : Math.min(this.acceleration.y + accelerationChange, this.maxAcceleration);
    }
  }

  changePosition(x, y) {
    this.x = x
    this.y = y
  }
}