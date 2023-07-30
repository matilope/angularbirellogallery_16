import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren, PLATFORM_ID, inject } from '@angular/core';
import { Painting, PaintingsObservable } from '@core/models/painting';
import { PaintingsService } from '@shared/services/paintings.service';
import { Global } from '@global/global';
import { MessageService } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { NgFor, NgIf, isPlatformBrowser } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ImgBrokenDirective } from '@shared/directives/img-broken.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [PaintingsService, MessageService],
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, ImgBrokenDirective, ProgressSpinnerModule, FormsModule, InputTextModule, ToastModule]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  public paintings!: Painting[];
  public url: string;
  public subscription!: Subscription;
  public subscription2!: Subscription;
  public subscription3!: Subscription;
  public subscription4!: Subscription;

  public currentPage: number = 1;
  public totalPages!: number;
  @ViewChildren('theLastList') public theLastList!: QueryList<ElementRef>;

  private observer!: IntersectionObserver;;

  public loader: boolean = false;
  public search: string = '';
  private search$: Subject<string> = new Subject<string>();
  private destroy$: Subject<void> = new Subject<void>();
  public isBrowser!: boolean;

  private _paintingService: PaintingsService = inject(PaintingsService);
  private _messageService: MessageService = inject(MessageService);
  private platformId: object = inject(PLATFORM_ID);

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.url = Global.url;
  }

  ngOnInit(): void {
    this.intersectionObserver();
    this.loader = true;
    this.subscription = this._paintingService
      .getPaintingsPagination(this.currentPage).subscribe({
        next: (response: PaintingsObservable) => {
          if (response.status == 'Success') {
            this.loader = false;
            this.paintings = response.paints;
            this.totalPages = response.results.total;
          }
        }
      });
    this.search$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((searchTerm: string) => {
        if (searchTerm.length >= 3) {
          this.loader = true;
          this.subscription4 = this._paintingService.search(searchTerm).subscribe({
            next: (response: PaintingsObservable) => {
              this.loader = false;
              if (response.status == 'Success' && response.paints.length > 0) {
                this._messageService.add({ severity: 'success', summary: 'Success', detail: 'The search query has results' });
                this.paintings = response.paints;
              } else {
                this._messageService.add({ severity: 'warn', summary: 'Warning', detail: `The search query doesn't have results` });
                this.resetSearch();
              }
            },
            error: () => {
              this._messageService.add({ severity: 'error', summary: 'Error', detail: 'The search query failed, error code 500' });
              this.loader = false;
              this.resetSearch();
            }
          });
        }
      });
  }

  ngAfterViewInit(): void {
    if ((isPlatformBrowser(this.platformId))) {
      this.subscription3 = this.theLastList.changes.subscribe({
        next: (response) => {
          if (response.last) {
            this.observer.observe(response.last.nativeElement);
          }
        }
      });
    }
  }

  trackByFn(index: number, item: Painting): string {
    return item._id;
  }

  searchHttp(): void {
    this.search$.next(this.search);
  }

  resetSearch(): void {
    this.currentPage = 1;
    this.search = '';
    this.paintings = [];
    this.paintingsData();
  }

  paintingsData(): void {
    this.loader = true;
    this.subscription2 = this._paintingService
      .getPaintingsPagination(this.currentPage)
      .subscribe({
        next: (response: PaintingsObservable) => {
          this.loader = false;
          response.paints.sort(() => {
            return 0.5 - Math.random();
          }).forEach((e) => {
            this.paintings.push(e);
          });
          this.totalPages = response.results.total;
        },
      });
  }

  intersectionObserver(): void {
    let options = {
      root: null,
      rootMargin: '4px',
      threshold: 1
    };
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
          this.paintingsData();
        }
      }
    }, options);
  }

  ngOnDestroy(): void {
    [this.subscription, this.subscription2, this.subscription3, this.subscription4].forEach(e => e?.unsubscribe());
    this.destroy$.next();
    this.destroy$.complete();
    if (isPlatformBrowser(this.platformId)) {
      this.observer.disconnect();
    }
  }
}
