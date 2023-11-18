class Shoot {
  constructor(x, y, screenWidth, speed = 100) {
    this.x = x;
    this.y = y;
    this.uuid = 'shoot_' + Math.random().toString(36).substr(2, 9);
    this.width = 30;
    this.height = 5;
    this.speed = speed;
    this.screenWidth = screenWidth;
    this.onFinish = () => { };
    this.time = null;
    this.secondsToUpdate = 0.05;
  }

  draw(ctx) {
    if (this.x > this.screenWidth) {
      this.onFinish();
      return;
    }
    const now = this.time? new Date(): null;
    const diff = now? ((now - this.time) / 1000): null;
    if (!now || diff > this.secondsToUpdate) {
      this.time = now || new Date();
      this.x += this.speed;
    }
    ctx.save();
    // gradient color
    const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(1, '#fff');
    ctx.fillStyle = gradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }

}
