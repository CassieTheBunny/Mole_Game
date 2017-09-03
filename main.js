'use strict';

class GameBoard {
  //* -- constructor(height, width): Global class variables -- *//
  constructor(height, width) {
    this.height = height;   // amount of rows the board will have
    this.width = width;     // amount of columns the board will have
    this.maxActive = 3      // max active moles on board
    this.time = '00:00';    // game timer
    this.score = 0;         // game score

    this.startGame = this.startGame.bind(this);
    this.scorePoints = this.scorePoints.bind(this);
  }

  //* -- createGrid(): Assembles game board from height and width data values -- *//
  createGrid() {
    let rows = '';
    for(let x = 0; x < this.width; x += 1) {
      rows = '<div class="grid-row">';

      for(let y = 0; y < this.height; y += 1) {
        rows += '<div class="grid-cell"></div>';
      }

      rows += '</div>';
      $(rows).appendTo('.grid');
    }
  }

  //* -- clearActive(): Clear all active moles from game board -- *//
  clearActive() {
    const active = $('.active').toArray();
    for(let i of active) { $(i).removeClass('active'); }
  }

  //* -- randomize(): Create random locations for active moles on game board -- *//
  randomize() {
    const cells = $('.grid-cell').toArray();
    const random = [];

    // clear current active moles first!
    this.clearActive();

    for(let j = 0; j < this.maxActive; j += 1) {
      let r = Math.floor(Math.random() * cells.length);
      random.push(cells[r]);
    }

    for(let k of random) { $(k).addClass('active'); }
  }

  //* -- scorePoints(event): Adjust score display when mole is clicked -- *//
  scorePoints(event) {
    if(this.timer !== '00:00') {
      this.score += 1;
      $('.score').text(this.score);
    }

    // remove mole that was hit!
    $(event.target).removeClass('active');
  }

  //* -- resetGame(): Reset score -> 0, timer -> 00:00, removes all active moles --*//
  resetGame() {
    setTimeout(() => {
      clearInterval(this.gamePlay);
      clearInterval(this.gameTimer);

      $('.timer').text('00:00');

      // clear current active moles!
      this.clearActive();

      $('.grid').addClass('stop');
      $('.luck').fadeOut(() => {
        $('.start').fadeIn();
      });
    }, 1000);
  }

  //* -- startTimer(d): Starts game timer countdown for 'd' seconds -- *//
  startTimer(d) {
    let timer = d, m, s;

    this.gameTimer = setInterval(() => {
      m = parseInt(d / 60, 10);
      s = parseInt(d % 60, 10);

      m = m < 10 ? `0${m}` : m;
      s = s < 10 ? `0${s}` : s;

      $('.timer').text(`${m}:${s}`);

      this.time = --d;
      if(d == 0) {
        // timer == 00:00, reset game!
        this.resetGame();
      }
    }, 1000);
  }

  //* -- startGame(): Starts game.. -- *//
  startGame() {
    $('.start').fadeOut(() => {
      $('.luck').show();
    });
    $('.grid').removeClass('stop');
    this.score = 0;
    $('.score').text(this.score);

    // start the timer!
    this.startTimer(15);
    this.gamePlay = setInterval(() => {
        // send out the moles!
        this.randomize();
    }, 1250);
  }

  //* -- init(): Game initialization -- *//
  init() {
    // create the game board!
    this.createGrid();

    // event handlers
    $('button.start').on('click', this.startGame);
    $('.grid').on('click', '.active', this.scorePoints);
  }
}

$(document).ready(() => {
  let newGame = new GameBoard(3, 3);
  newGame.init();
});
