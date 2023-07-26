import { Directive, ElementRef, HostListener, Renderer2, inject } from '@angular/core';

@Directive({
  selector: 'img[appImgBroken]',
  standalone: true
})
export class ImgBrokenDirective {
  private imgHost: ElementRef = inject(ElementRef);
  private renderer: Renderer2 = inject(Renderer2);

  @HostListener('error') public handleError(): void {
    this.renderer.setAttribute(this.imgHost.nativeElement, 'src', '/assets/img/default/default.png');
  }
}
