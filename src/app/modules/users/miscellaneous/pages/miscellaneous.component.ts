import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, PLATFORM_ID, QueryList, ViewChildren, inject } from '@angular/core';
import { Instagram } from '@core/models/instagram';
import { InstagramService } from '@shared/services/instagram.service';
import { ActivatedRoute } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { Token } from '@core/models/token';
import { Subscription } from 'rxjs';
import { NgFor, NgIf, isPlatformBrowser } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-miscellaneous',
  templateUrl: './miscellaneous.component.html',
  styleUrls: ['./miscellaneous.component.scss'],
  standalone: true,
  imports: [NgFor, NgIf, CardModule, ProgressSpinnerModule]
})
export class MiscellaneousComponent implements OnInit, AfterViewInit, OnDestroy {
  public insta!: Instagram[];
  public token!: Token;
  public next!: string;

  private subscription!: Subscription;
  private subscription2!: Subscription;
  private subscription3!: Subscription;
  private subscription4!: Subscription;

  public url!: string;
  public content!: string;

  @ViewChildren('theLastList', { read: ElementRef })
  public theLastList!: QueryList<ElementRef>;

  private observer: IntersectionObserver;
  public loader: boolean = false;
  public data: any;
  public isBrowser!: boolean;

  private _instagramService: InstagramService = inject(InstagramService);
  private metaService: Meta = inject(Meta);
  private platformId: object = inject(PLATFORM_ID);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.metaService.updateTag({
      name: 'title',
      content: 'Birello Gallery | Miscellaneous',
    });
    this.metaService.updateTag({
      name: 'description',
      content: 'Instagram of Birello Gallery, full of amazing paintings',
    });
    this.metaService.updateTag({
      property: 'og:title',
      content: 'Birello Gallery | Miscellaneous',
    });
    this.metaService.updateTag({
      property: 'og:description',
      content: 'Instagram of Birello Gallery, full of amazing paintings',
    });
    this.metaService.updateTag({
      property: 'og:url',
      content: 'https://www.birellogallery.com/miscellaneous',
    });
    this.metaService.updateTag({
      property: 'twitter:title',
      content: 'Birello Gallery | Miscellaneous',
    });
    this.metaService.updateTag({
      property: 'twitter:description',
      content: 'Instagram of Birello Gallery, full of amazing paintings',
    });
    this.metaService.updateTag({
      property: 'twitter:url',
      content: 'https://www.birellogallery.com/miscellaneous',
    });
  }


  ngOnInit(): void {
    this.loader = true;
    this.subscription = this.activatedRoute.data.subscribe({
      next: (response: any) => {
        if (response.token.status === "Success") {
          this.token = response.token.token.token._id;
          this.content = response.token.token.token;
          this.subscription2 = this._instagramService
            .getInstagram(this.content)
            .subscribe({
              next: response => {
                this.loader = false;
                this.insta = response.data;
                this.data = response.data;
                if (response.paging.cursors.after) {
                  this.next = response.paging.cursors.after;
                }
              },
            });
        }
      }
    });
    this.intersectionObserver();
  }

  ngAfterViewInit(): void {
    this.subscription3 = this.theLastList.changes.subscribe({
      next: (response) => {
        if (response.last) {
          if ((isPlatformBrowser(this.platformId))) {
            this.observer.observe(response.last.nativeElement);
          }
        }
      }
    });
  }

  intersectionObserver(): void {
    let options = {
      root: null,
      rootMargin: '0px',
      threshold: 0
    };

    if ((isPlatformBrowser(this.platformId))) {
      this.observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (this.data.length > 1) {
            this.loader = true;
            this.subscription4 = this._instagramService
              .getInstagramNext(this.content, this.next)
              .subscribe({
                next: (response) => {
                  this.loader = false;
                  if (response.paging) {
                    this.next = response.paging.cursors.after;
                    this.data = response.data;
                    response.data.forEach((e: any) => {
                      this.insta.push(e);
                    });
                  } else {
                    this.data = [];
                  }
                }
              })
          }
        }
      }, options);
    }
  }

  ngOnDestroy(): void {
    [this.subscription, this.subscription2, this.subscription3, this.subscription4].forEach(e => e?.unsubscribe());
    if (isPlatformBrowser(this.platformId)) {
      this.observer.disconnect();
    }
  }
}
