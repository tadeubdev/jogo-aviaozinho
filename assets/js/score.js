class Score {
  constructor(score) {
    this.score = score;
    this.lastScoreUpdate = null
  }

  increment() {
    const now = new Date().getTime()
    const diff = this.lastScoreUpdate? now - this.lastScoreUpdate: null
    // só atualiza se tiver passado 10 segundos
    if (diff && diff < 1000) {
      return
    }
    this.score++
    this.lastScoreUpdate = new Date().getTime()
  }

  save() {
    let highScore = parseInt(localStorage.getItem('highScore') || 0)
    if (this.score > highScore) {
      localStorage.setItem('highScore', this.score)
    }
  }

  clear() {
    this.score = 0
    this.lastScoreUpdate = null
  }

  get() {
    return this.score
  }

  getHighScore() {
    return parseInt(localStorage.getItem('highScore') || 0)
  }

  draw(ctx) {
    let score = this.get()
    // fill score with zero if less than 5 digits
    while (score.toString().length < 5) {
      score = '0' + score
    }
    score = "SCORE         " + score
    ctx.font = "bold 20px Poppins";
    ctx.fillStyle = "rgba(0,0,0,.6)";
    ctx.fillText(score, ctx.canvas.width - 200, 40);

    let highScore = this.getHighScore()
    // fill score with zero if less than 5 digits
    while (highScore.toString().length < 5) {
      highScore = '0' + highScore
    }
    highScore = "HIGH SCORE             " + highScore
    ctx.font = "500 14px Poppins";
    ctx.fillStyle = "rgba(0,0,0,.6)";
    ctx.fillText(highScore, ctx.canvas.width - 216, 60);
  }
}