import chalk from 'chalk';

type barStyle = 'basic' | 'fun' | 'personnal';
// FIXME: handle the position for multiple progressbar
// FIXME: algo of smooth trackbar
// FIXME: personnaliser avec des symbol
export default class ConsoleProgressBar {
  symbolStart = '╰ ';
  symbolEnd = ' ╯';
  symbolForegroundProgress = '■';
  symbolBackgroundProgress = '□';
  isTitleShow = true;
  position = {
    x: 0,
    y: 0
  }

  constructor(private titleOfTheBar = 'Progress bar', private lengthOfTheBar = 80, private minimum = 0, private maximum = 100, private styleSelected: barStyle = 'basic') {
    this.setStyle(styleSelected);
  }

  setStyle(style: barStyle) {
    switch (style) {
      case 'basic':
        this.symbolStart = chalk.white('[ ');
        this.symbolEnd = chalk.white(' ]');
        this.symbolForegroundProgress = chalk.green('☰');
        this.symbolBackgroundProgress = chalk.white('𝍖');
        break;
      case 'fun':
        this.symbolStart = ' ';
        this.symbolEnd = ' ';
        this.symbolForegroundProgress = '◉';
        this.symbolBackgroundProgress = '◎';
        break;
      case 'personnal':
        break;
      default:
        break;
    }
  }

  setPosition(x:number,y:number) {
    this.position.x = x;
    this.position.y = y;
  }

  disableTitle() {
    this.isTitleShow = false;
  }

  enableTitle() {
    this.isTitleShow = true;
  }

  setPersonalizedStyle() {

  }

  setExtremum(minimum:number, maximum:number) {
    this.minimum = minimum;
    this.maximum = maximum;
  }

  setLengthOfTheBar(lengthInChar:number) {
    this.lengthOfTheBar = lengthInChar;
  }

  updateAndDraw(currentValue:number) {

    // responsive bar
    if(process.stdout.columns < this.lengthOfTheBar + this.position.x) {
      // - 13 is the security margin
      this.lengthOfTheBar = this.lengthOfTheBar - (this.position.x + this.lengthOfTheBar - process.stdout.columns) - 13;
    }

    process.stdout.cursorTo(this.position.x, this.position.y);
    if(this.isTitleShow) {
      process.stdout.write( `╭ ${this.titleOfTheBar} ╮\n`);
      process.stdout.cursorTo(this.position.x, this.position.y + 1);
    }

    const relatifCursorChar = (currentValue / this.maximum) * this.lengthOfTheBar;
    let bar = `` + this.symbolStart;
    // draw foreground progress
    for (let i = this.minimum; i <= relatifCursorChar; i++) {
      bar = bar + this.symbolForegroundProgress;
    }
    // draw background progress
    for (let i = relatifCursorChar; i < this.lengthOfTheBar; i++) {
      bar = bar + this.symbolBackgroundProgress;
    }
    bar = `${bar} ${this.symbolEnd} ${currentValue}/${this.maximum}` + ' ';

    process.stdout.write(bar);
  }
}
