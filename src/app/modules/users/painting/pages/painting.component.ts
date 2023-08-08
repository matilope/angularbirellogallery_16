import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Painting } from '@core/models/painting';
import { Router, ActivatedRoute } from '@angular/router';
import { Global } from '@global/global';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Title, Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ImgBrokenDirective } from '@shared/directives/img-broken.directive';
import { AccordionModule } from 'primeng/accordion';
import { NgIf } from '@angular/common';
import { FormatterPipe } from '@shared/pipes/formatter.pipe';

@Component({
  selector: 'app-painting',
  templateUrl: './painting.component.html',
  styleUrls: ['./painting.component.scss'],
  standalone: true,
  imports: [NgIf, ImgBrokenDirective, AccordionModule, FormatterPipe]
})
export class PaintingComponent implements OnInit, OnDestroy {
  public jsonLD!: object;
  public html!: SafeHtml;
  public painting!: Painting;
  public url: string;
  public subscription!: Subscription;
  public subscription2!: Subscription;
  public link!: string;
  public link2!: string;
  public imageSelected!: string | null;

  private sanitizer: DomSanitizer = inject(DomSanitizer);
  private router: Router = inject(Router);
  private titleService: Title = inject(Title);
  private metaService: Meta = inject(Meta);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    this.url = Global.url;
  }

  ngOnInit(): void {
    this.subscription2 = this.activatedRoute.data.subscribe({
      next: (response: any) => {
        if (response.painting.paint) {
          this.painting = response.painting.paint;
          this.imageSelected = this.painting.image0url;
          this.titleService.setTitle(this.painting.title);

          if (response.painting.paint.link.length > 2) {
            const urlFirst = new URL(this.painting.link);
            this.link = urlFirst.host;
          }

          if (response.painting.paint.link2.length > 2) {
            const urlSecond = new URL(this.painting.link2);
            this.link2 = urlSecond.host;
          }

          this.metaService.updateTag({
            name: 'title',
            content: 'Birello Gallery | ' + this.painting.title,
          });
          this.metaService.updateTag({
            name: 'description',
            content: this.painting.description.split(".")[0],
          });
          this.metaService.updateTag({
            property: 'og:title',
            content: 'Birello Gallery | ' + this.painting.title,
          });
          this.metaService.updateTag({
            property: 'og:description',
            content: this.painting.description.split(".")[0],
          });
          this.metaService.updateTag({
            property: 'og:image',
            content: this.painting.image0url,
          });
          this.metaService.updateTag({
            property: 'og:url',
            content:
              'https://www.birellogallery.com/painting/view/' +
              this.painting._id,
          });
          this.metaService.updateTag({
            name: 'keywords',
            content: this.painting.title + ', ' + this.painting.subtitle,
          });
          this.metaService.updateTag({
            property: 'twitter:title',
            content: 'Birello Gallery | ' + this.painting.title,
          });
          this.metaService.updateTag({
            property: 'twitter:description',
            content: this.painting.description.split(".")[0],
          });
          this.metaService.updateTag({
            property: 'twitter:image',
            content: this.painting.image0url,
          });
          this.metaService.updateTag({
            property: 'twitter:url',
            content:
              'https://www.birellogallery.com/painting/view/' +
              this.painting._id,
          });
        } else {
          this.router.navigate(['/']);
        }
      }
    });
    this.jsonLD = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": this.painting.title,
      "description": this.painting.description.split(".")[0],
      "review": {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": parseFloat((Math.random() * (4.9 - 4.5) + 4.5).toFixed(1)),
          "bestRating": 5
        },
        "author": {
          "@type": "Person",
          "name": "John"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": parseFloat((Math.random() * (4.9 - 4.3) + 4.3).toFixed(1)),
        "reviewCount": Math.floor(Math.random() * (20 - 10) + 11)
      }
    };
    this.html = this.getSafeHTML(this.jsonLD);
  }

  changeImage(i: number): void {
    this.imageSelected = this.painting[`image${i}url`];
  }

  getSafeHTML(jsonLD: { [key: string]: any }): SafeHtml {
    const json = jsonLD ? JSON.stringify(jsonLD, null, 2).replace(/<\/script>/g, '<\\/script>') : '';
    const html = `<script type="application/ld+json">${json}</script>`;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  ngOnDestroy(): void {
    [this.subscription, this.subscription2].forEach(e => e?.unsubscribe());
  }
}
