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
    this.metaService.updateTag({
      name: 'title',
      content: 'Birello Gallery | Refund Policy',
    });
    this.metaService.updateTag({
      name: 'description',
      content: 'Read our refund policy',
    });
    this.metaService.updateTag({
      property: 'og:title',
      content: 'Birello Gallery | Refund Policy',
    });
    this.metaService.updateTag({
      property: 'og:description',
      content: 'Read our refund policy',
    });
    this.metaService.updateTag({
      property: 'og:url',
      content: 'https://www.birellogallery.com/refundpolicy',
    });
    this.metaService.updateTag({
      property: 'twitter:title',
      content: 'Birello Gallery | Refund policy',
    });
    this.metaService.updateTag({
      property: 'twitter:description',
      content: 'Read our Refund policy',
    });
    this.metaService.updateTag({
      property: 'twitter:url',
      content: 'https://www.birellogallery.com/refundpolicy',
    });
  }
}
