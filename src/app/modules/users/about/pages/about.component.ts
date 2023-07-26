import { Component, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { CarouselModule, CarouselResponsiveOptions } from 'primeng/carousel';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  standalone: true,
  imports: [CarouselModule]
})
export class AboutComponent {
  public images: object[] = [];
  public responsiveOptions: CarouselResponsiveOptions[] = [];

  private metaService: Meta = inject(Meta);

  constructor() {
    this.metaService.updateTag({
      name: 'title',
      content: 'Birello Gallery | About',
    });
    this.metaService.updateTag({
      name: 'description',
      content:
        'Birello Gallery is an emerging familiar business searching for the best products thinking in quality, value and exquisiteness. The products we offer not only delight customers regarding decorative value but also considering art itself as an investment for the future.',
    });
    this.metaService.updateTag({
      property: 'og:title',
      content: 'Birello Gallery | About',
    });
    this.metaService.updateTag({
      property: 'og:description',
      content:
        'Birello Gallery is an emerging familiar business searching for the best products thinking in quality, value and exquisiteness. The products we offer not only delight customers regarding decorative value but also considering art itself as an investment for the future.',
    });
    this.metaService.updateTag({
      property: 'og:url',
      content: 'https://www.birellogallery.com/about',
    });
    this.metaService.updateTag({
      property: 'twitter:title',
      content: 'Birello Gallery | About',
    });
    this.metaService.updateTag({
      property: 'twitter:description',
      content:
        'Birello Gallery is an emerging familiar business searching for the best products thinking in quality, value and exquisiteness. The products we offer not only delight customers regarding decorative value but also considering art itself as an investment for the future.',
    });
    this.metaService.updateTag({
      property: 'twitter:url',
      content: 'https://www.birellogallery.com/about',
    });
    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
      }
    ];
    this.images = [
      {
        image: "/assets/img/about/museum_enrique_larreta.webp",
        alt: "Museum of Spanish Art Enrique Larreta"
      },
      {
        image: "/assets/img/about/colonial_art_birello.webp",
        alt: "Ignacio Birello surrounding with colonial paintings"
      },
      {
        image: "/assets/img/about/museum_decorative_birello.webp",
        alt: "An amazing Dutch family portrait at 'Museo Decorativo' Buenos Aires, Argentina"
      },
      {
        image: "/assets/img/about/birello_and_steven.webp",
        alt: "Ignacio Birello with Steven from Australia in 2019"
      },
      {
        image: "/assets/img/about/circle_maarten_van_heemskerck.webp",
        alt: "Circle of Maarten van Heemskerck, Babel Tower, measuring 139 x 181cm"
      },
      {
        image: "/assets/img/about/birello_shipping_painting.webp",
        alt: "Ignacio Birello next to a painting ready to be shipped"
      }
    ];
  }
}
