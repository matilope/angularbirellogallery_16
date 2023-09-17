import { Component, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-refundpolicy',
  templateUrl: './refundpolicy.component.html',
  styleUrls: ['./refundpolicy.component.scss'],
  standalone: true,
  imports: [AccordionModule]
})
export class RefundpolicyComponent {
  public title: string;
  private metaService: Meta = inject(Meta);

  constructor() {
    this.title = 'IMPORTANT, PLEASE READ CAREFULLY';
    this.metaService.addTag({
      name: 'robots',
      content: 'noindex, nofollow',
    });
  }
}
