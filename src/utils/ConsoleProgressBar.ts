import chalk from 'chalk';

type barStyle = 'basic' | 'fun';

export default class ConsoleProgressBar {
  symbolStart = '|';
  symbolEnd = '|';
  symbolForegroundProgress = '■';
  symbolBackgroundProgress = '□';

  constructor(private nameOfTheBar = 'Progress bar') {

  }

  setStyle(style: barStyle) {
    switch (style) {
      case 'basic':
        this.symbolStart = '|';
        this.symbolEnd = '|';
        this.symbolForegroundProgress = '■';
        this.symbolBackgroundProgress = '□';
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
}
