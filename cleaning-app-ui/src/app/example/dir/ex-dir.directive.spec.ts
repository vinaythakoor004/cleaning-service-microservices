import { ExDirDirective } from './ex-dir.directive';

describe('ExDirDirective', () => {
  it('should create an instance', () => {
    const mockElement: any = document.createElement('div');
    const directive = new ExDirDirective(mockElement);
    expect(directive).toBeTruthy();
  });
});
