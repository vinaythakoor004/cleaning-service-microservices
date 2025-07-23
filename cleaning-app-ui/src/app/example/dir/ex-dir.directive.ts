import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHeightLight]'
})
export class ExDirDirective {
  @Input('appHeightLight') highLight: string = 'Yellow';

  constructor(private el: ElementRef) { }
  @HostListener('mouseenter') onMouseEnter() {
    this.highLightEl(this.highLight);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highLightEl('');
  }

  highLightEl(color: string) {
    this.el.nativeElement.style.background = color;
  }

}
