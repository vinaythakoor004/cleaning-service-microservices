import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { BackgroundColorDirective } from './directive/background-color.directive';
import { DemoPipePipe } from './pipe/demo-pipe.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [ CommonModule, TranslatePipe, BackgroundColorDirective, DemoPipePipe ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  color: string = 'red';
  constructor() {

  }
}
