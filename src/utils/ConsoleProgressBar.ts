import chalk from 'chalk';

type barStyle = 'basic' | 'fun' | 'personnal';
// FIXME: handle the position for multiple progressbar
// FIXME: algo of smooth trackbar
// FIXME: personnaliser avec des symbol
// FIXME: add loading animation with symbol (must be a timer 60 fps)
// FIXME: Number must be in the same monospace space
export default class ConsoleProgressBar {
  beginTitleSymbol = '§';
  endTitleSymbol = '§';
  startSymbol = '╰';
  endSymbol = '╯';
  ForegroundProgressSymbol = '■';
  backgroundProgressSymbol = '□';
  isTitleShow = true;
  position = {
    x: 0,
    y: 0
  };
  currentValue = 0;
  timer: NodeJS.Timeout | undefined;
  loadingSymbols = ['⋮', '⋰', '⋯','⋱'];
  loadingCursor = 0;

  constructor(private titleOfTheBar = 'Progress bar', private lengthOfTheBar = 80, private minimum = 0, private maximum = 100, private styleSelected: barStyle = 'basic') {
    this.setStyle(styleSelected);
  }

  setStyle(style: barStyle) {
    switch (style) {
      case 'basic':
        this.startSymbol = chalk.white('[ ');
        this.endSymbol = chalk.white(' ]');
        this.ForegroundProgressSymbol = chalk.green('☰');
        this.backgroundProgressSymbol = chalk.white('𝍖');
        break;
      case 'fun':
        this.startSymbol = ' ';
        this.endSymbol = ' ';
        this.ForegroundProgressSymbol = '◉';
        this.backgroundProgressSymbol = '◎';
        break;
      case 'personnal':
        break;
      default:
        break;
    }
  }

  setPosition(x: number, y: number) {
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

  setExtremum(minimum: number, maximum: number) {
    this.minimum = minimum;
    this.maximum = maximum;
  }

  setLengthOfTheBar(lengthInChar: number) {
    this.lengthOfTheBar = lengthInChar;
  }

  private drawTitle() {
    // reponsive title
    if (this.position.x + this.titleOfTheBar.length > process.stdout.columns) {
      const overtakingWidth = this.titleOfTheBar.length - ((this.position.x + this.titleOfTheBar.length) - process.stdout.columns);
      // - 6 is the margin to be safe
      this.titleOfTheBar = this.titleOfTheBar.substr(0, overtakingWidth - 6) + '…';
    }
    process.stdout.write(`${this.beginTitleSymbol} ${this.titleOfTheBar} ${this.endTitleSymbol}\n`);
    process.stdout.cursorTo(this.position.x, this.position.y + 1);
  }

  drawProgressBar() {
    // responsive bar on x axe
    if (process.stdout.columns < this.lengthOfTheBar + this.position.x) {
      // - 13 is the security margin
      this.lengthOfTheBar = this.lengthOfTheBar - (this.position.x + this.lengthOfTheBar - process.stdout.columns) - 15;
    }

    const relatifCursorChar = (this.currentValue / this.maximum) * this.lengthOfTheBar;
    let bar = `` + this.startSymbol + `${this.isDynamicMode() ? this.drawLoadingCursor():false} `;
    // draw foreground progress
    for (let i = this.minimum; i <= relatifCursorChar; i++) {
      bar = bar + this.ForegroundProgressSymbol;
    }

    // draw background progress
    for (let i = relatifCursorChar; i < this.lengthOfTheBar; i++) {
      bar = bar + this.backgroundProgressSymbol;
    }
    bar = `${bar} ${this.endSymbol} ${this.currentValue}/${this.maximum}` + ' ';

    process.stdout.write(bar);
  }

  staticDraw(currentValue: number) {
    if (this.isTitleShow) { this.drawTitle(); }
    this.drawProgressBar();
  }

  private callbackUpdate() {
    process.stdout.cursorTo(this.position.x, this.position.y);
    if (this.isTitleShow) { this.drawTitle(); }
    this.drawProgressBar();

    // if progress bar hit the end of the bar
    if(this.currentValue >= this.maximum) { this.stopDynamicUpdate(); }
  }

  drawLoadingCursor() {
    // table's progress
    this.loadingCursor++;
    if(this.loadingCursor === this.loadingSymbols.length - 1) { this.loadingCursor = 0}
    return this.loadingSymbols[this.loadingCursor];
  }

  private isDynamicMode():boolean {
    return this.timer !== undefined;
  }

  dynamicUpdate(currentValue: number) {
    this.currentValue = currentValue;
    // 25 frame per seconde
    if(this.timer === undefined) {
      this.timer = setInterval(this.callbackUpdate.bind(this) ,100);
    }
  }

  stopDynamicUpdate() {
    if(this.timer !== undefined) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }
}
