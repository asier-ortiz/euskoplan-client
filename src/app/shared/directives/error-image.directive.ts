import {Directive, Input} from '@angular/core';

// Uso:
// <img src="broken.jpg" default="placeholder.jpg">

@Directive({
  selector: 'img[default]',
  host: {
    '(error)': 'updateUrl()',
    '[src]': 'src'
  }
})
export class ErrorImageDirective {

  @Input() src: string;
  @Input() default: string;

  updateUrl() {
    this.src = this.default;
  }
}
