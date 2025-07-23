import { ElementRef } from "@angular/core";
import { BackgroundColorDirective } from "./background-color.directive";

describe('BackgroundColorDirective', () => {
  it('should create an instance', () => {
    const mockElement: any = document.createElement('div');
    const directive = new BackgroundColorDirective(mockElement);
    expect(directive).toBeTruthy();
  });
});
