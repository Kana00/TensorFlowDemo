import chalk from 'chalk';

type barStyle = 'basic' | 'fun';

export default class ConsoleProgressBar {
  symbolStart = '|';
  symbolEnd = '|';
  symbolForegroundProgress = '■';
  symbolBackgroundProgress = '□';
  isTitleShow = true;

  constructor(private titleOfTheBar = 'Progress bar', private lengthOfTheBar = 80, private minimum = 0, private maximum = 100) {
    this.setStyle('basic');
  }

  setStyle(style: barStyle) {
    switch (style) {
      case 'basic':
        this.symbolStart = chalk.white('|');
        this.symbolEnd = chalk.white('|');
        this.symbolForegroundProgress = chalk.green('■');
        this.symbolBackgroundProgress = chalk.white('□');
        break;
      case 'fun':
        this.symbolStart = '';
        this.symbolEnd = '';
        this.symbolForegroundProgress = '◉';
        this.symbolBackgroundProgress = '◎';
        break;
      default:
        break;
    }
  }

  setExtremum(minimum:number, maximum:number) {
    this.minimum = minimum;
    this.maximum = maximum;
  }

  setLengthOfTheBar(lengthInChar:number) {
    this.lengthOfTheBar = lengthInChar;
  }

  updateAndDraw(currentValue:number) {
    if(this.isTitleShow) {
      process.stdout.write( `[ ${this.titleOfTheBar} ]\n`);
    }

    // process.stdout.cursorTo(0);
    // process.stdout.clearLine(0);
    let bar = `` + this.symbolStart;
    for (let i = 0; i < this.lengthOfTheBar; i++) {
      bar = bar + this.symbolForegroundProgress;
    }
    bar = bar + this.symbolEnd;
    process.stdout.write(bar);
  }
}
