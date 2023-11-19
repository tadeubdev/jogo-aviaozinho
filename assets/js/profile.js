class Profile {
  constructor() {
    this.x = 10
    this.y = 10
    this.width = 200
    this.height = 20
    this.life = 100
    this.maxLife = 100
    this.minLife = 0
    this.decrementValue = 20
  }

  draw(ctx) {
    // draw a rectangle with the max life
    ctx.fillStyle = 'red'
    ctx.fillRect(this.x, this.y, this.width, this.height)

    // draw a rectangle with the current life
    ctx.fillStyle = 'green'
    ctx.fillRect(this.x, this.y, this.width * (this.life / this.maxLife), this.height)

    // draw a border around the rectangle
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 0.5
    ctx.strokeRect(this.x, this.y, this.width, this.height)

    // write the text with the current life
    const percentage = Math.ceil((this.life / this.maxLife) * 100)
    ctx.fillStyle = 'white'
    ctx.font = '12px Poppins'
    ctx.fillText(`${percentage}%`, this.width / 2, this.y + this.height - 5)
  }
  
  isAlive() {
    return this.life > this.decrementValue && this.life > this.minLife;
  }

  decrement() {
    this.life -= this.decrementValue
  }
}