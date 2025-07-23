import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appBackgroundColor]'
})
export class BackgroundColorDirective {
  @Input('appBackgroundColor') color: string = 'Yellow';
  constructor(private el: ElementRef) { }
  @HostListener('mouseenter')
    mouseEnter() {
      this.changeColor(this.color);
    }
  
  @HostListener('mouseleave') 
    mouseLeave() {
      this.changeColor('');
    }

  changeColor(color: string): void {
    this.el.nativeElement.style.background = color;
  }
}
