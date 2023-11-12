class Clouds {
  constructor() {
    this.x = 0; // posição X inicial
    this.y = 0; // posição Y (você pode ajustar isso conforme necessário)
    this.speed = Math.random() * 0.5 + 0.5; // velocidade de movimento das nuvens
    this.inverted = Math.random() >= 0.5; // se a nuvem deve ser invertida ou não
    this.blur = Math.random() >= 0.5; // se a nuvem deve ter blur ou não
    this.width = 150;
    this.height = 60;
    this.image = new Image();
    this.image.src = '/assets/img/cloud.png';
  }

  clear() {
    this.x = 0;
    this.y = 0;
    this.speed = Math.random() * 0.5 + 0.5;
    this.inverted = Math.random() >= 0.5;
    this.blur = Math.random() >= 0.5;
    this.width = 150;
    this.height = 60;
  }

  draw(ctx) {
    if (this.image.complete) {
      ctx.save(); // Salva o estado atual do contexto
      // set blur effect
      if (this.blur) {
        ctx.filter = 'blur(1px)';
      }
      // Desenhar a imagem com base na posição X e Y
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      ctx.restore();
    }

    // Atualizar a posição X
    this.x -= this.speed;

    // Resetar a posição X para criar um loop contínuo
    if (this.x <= -this.image.width) {
      this.x = ctx.canvas.width;
    }

    // Inverter a imagem se necessário
    if (this.inverted) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(this.image, -this.x - this.image.width, this.y, this.width, this.height);
      ctx.restore();
    } else {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }

  static generateClouds(canvasWidth, canvasHeight, total) {
    const clouds = [];
    const cloudRatios = [[150, 60], [90, 36], [30, 12]];
    const cloudSpeed = [0.8, 0.3, 0.2];
    for (let i = 0; i < total; i++) {
      const cloudRatioIndex = Math.floor(Math.random() * cloudRatios.length);
      const ratio = cloudRatios[cloudRatioIndex];
      const speed = cloudSpeed[cloudRatioIndex];
      const cloud = new Clouds()
      cloud.y = Math.random() * (canvasHeight - 120) + 60;
      cloud.x = Math.random() * canvasWidth;
      cloud.speed = speed
      cloud.inverted = Math.random() >= 0.5
      cloud.blur = cloudRatioIndex === cloudRatios.length - 1
      cloud.width = ratio[0]
      cloud.height = ratio[1]
      clouds.push(cloud)
    }
    // sort clouds by width
    clouds.sort((a, b) => a.width - b.width)
    return clouds
  }
}