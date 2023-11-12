class Floor {
  constructor() {
    this.x = 0; // posição X inicial
    this.y = 0; // posição Y (você pode ajustar isso conforme necessário)
    this.speed = 1; // velocidade de movimento do chão
    this.characterSpeed = 0; // velocidade de movimento do personagem
    this.image = new Image();
    this.image.src = '/assets/img/grass.png';
  }

  clear() {
    this.x = 0;
    this.y = 0;
    this.speed = 1;
    this.characterSpeed = 0;
  }

  updateCharacterSpeed(speedX) {
    if (Math.abs(speedX) > 0.01) {
      this.characterSpeed = speedX;
    } else {
      this.characterSpeed = 0;
    }
  }

  draw(ctx) {
    const ctxWidth = ctx.canvas.width;
    const ctxHeight = ctx.canvas.height;
    
    if (this.image.complete) {
      // Repetir a imagem para cobrir a largura do canvas
      for (let i = this.x; i < ctxWidth; i += this.image.width) {
        ctx.drawImage(this.image, i, ctxHeight - this.image.height);
      }
    }

    // Atualizar a posição X
    this.x -= this.speed + (this.characterSpeed > 0? this.characterSpeed: 0);
    
    // Resetar a posição X para criar um loop contínuo
    if (this.x <= -this.image.width) {
      this.x = 0;
    }
  }

}