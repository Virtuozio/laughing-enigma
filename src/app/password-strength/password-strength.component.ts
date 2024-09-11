import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-password-strength',
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.scss'],
})
export class PasswordStrengthComponent {
  @Input() public passwordToCheck?: string;
  @Output() messageEvent = new EventEmitter<string>();
  bars: string[] = ['#DDD', '#DDD', '#DDD'];

  msg: string = '';

  private colors = {
    gray: '#DDD',
    red: 'red',
    yellow: 'yellow',
    green: 'green',
  };

  ngOnChanges(changes: SimpleChanges): void {
    const password = changes['passwordToCheck']?.currentValue || '';

    if (password.length === 0) {
      this.setBarColors(3, this.colors.gray);
      this.msg = 'Type smth to submit';
    } else if (password.length < 8) {
      this.setBarColors(3, this.colors.red);
      this.msg = 'Poor';
    } else {
      const strength = this.checkStrength(password);
      if (strength === 'easy') {
        this.setBarColors(3, this.colors.gray);
        this.setBarColors(1, this.colors.red);
        this.msg = 'Not Good';
      } else if (strength === 'medium') {
        this.setBarColors(2, this.colors.yellow);
        this.setBarColors(1, this.colors.gray, 2);
        this.msg = 'Average';
      } else if (strength === 'strong') {
        this.setBarColors(3, this.colors.green);
        this.msg = 'Good';
      }
    }
    this.messageEvent.emit(this.msg);
  }

  checkStrength(password: string): 'easy' | 'medium' | 'strong' {
    const regex = /[$-/:-?{-~!"^_@`\[\]]/g;
    const letters = /[A-Za-z]+/.test(password);
    const numbers = /[0-9]+/.test(password);
    const symbols = regex.test(password);

    const passedMatches = [letters, numbers, symbols].filter(Boolean).length;

    if (passedMatches <= 1) {
      return 'easy';
    } else if (passedMatches === 2) {
      return 'medium';
    } else if (passedMatches === 3) {
      return 'strong';
    }
    return 'easy';
  }

  private setBarColors(count: number, color: string, start: number = 0) {
    for (let n = start; n < count; n++) {
      this.bars[n] = color;
    }
  }
}
