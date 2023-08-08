import { FormatterPipe } from './formatter.pipe';

describe('TextPipe', () => {
  it('create an instance', () => {
    const pipe = new FormatterPipe();
    expect(pipe).toBeTruthy();
  });
});
