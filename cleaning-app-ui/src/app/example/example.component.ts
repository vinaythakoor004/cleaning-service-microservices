import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ExDirDirective } from './dir/ex-dir.directive';
import { CommonModule } from '@angular/common';
import { ExPipePipe } from './pipe/ex-pipe.pipe';
import { table } from 'console';

@Component({
  selector: 'app-example',
  imports: [ CommonModule, ExDirDirective, ExPipePipe ],
  templateUrl: './example.component.html',
  styleUrl: './example.component.css'
})
export class ExampleComponent implements OnInit {
  color = 'red'
  board: string[][]= []

  ngOnInit(): void {
    this.genrateChessBoard();
  }

  genrateChessBoard(): string[][] {
    for(let row = 0; row< 8; row++) {
      this.board[row] = [];
      for(let col = 0; col< 8; col++) {
        this.board[row][col] = (row + col) % 2 === 0 ? 'white' : 'black';
      }
    }
    return this.board;
  }

    selectedValue: string = "a";
    onClick(e: any): void {
      this.selectedValue = e.target.value
    }

}
