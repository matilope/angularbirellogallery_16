import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, inject } from '@angular/core';
import { Location, NgIf } from '@angular/common';
import { Portrait } from '@core/models/portrait';
import { PortraitService } from '@shared/services/portrait.service';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [NgIf, RouterLink]
})

export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  public path!: string;
  public portrait!: Portrait;
  public routerEvent: Subscription;
  public isLoggedIn!: boolean;
  public subscription!: Subscription;
  public excludedPaths: string[] = ['404', 'admin'];

  @ViewChild('navLinks') public navLinks!: ElementRef;
  @ViewChild('button') public button!: ElementRef;

  private _authService: AuthService = inject(AuthService);
  private _portraitService: PortraitService = inject(PortraitService);
  private router: Router = inject(Router);
  private location: Location = inject(Location);
  private renderer: Renderer2 = inject(Renderer2);

  constructor() {
    this.routerEvent = this.router.events.subscribe(() => {
      this.path = this.location.path().split("/")[1];
    });
  }

  ngOnInit(): void {
    this.subscription = this._portraitService.getPortrait('64a4cb571625dd0281b55429').subscribe({
      next: response => {
        if (response.portrait) {
          this.portrait = response.portrait;
        }
      }
    });
    this.isLoggedIn = this._authService.cookieExists();
  }

  ngAfterViewInit(): void {
    this.closeNavOnLinkTouch();
  }

  ngOnDestroy(): void {
    this.routerEvent?.unsubscribe();
    this.subscription?.unsubscribe();
  }

  public collapse(event: any): void {
    if(event.key == "Enter" || event.type == 'click') {
      if (this.button.nativeElement.classList.contains('active')) {
        this.renderer.removeClass(this.button.nativeElement, "active");
      } else {
        this.renderer.addClass(this.button.nativeElement, "active");
      }
      if (this.navLinks.nativeElement.classList.contains('show')) {
        this.renderer.removeClass(this.navLinks.nativeElement, "show");
      } else {
        this.renderer.addClass(this.navLinks.nativeElement, "show");
      }
    }
  }

  public closeNavOnLinkTouch(): void {
    for (const child of Array.from(this.navLinks.nativeElement.children)) {
      this.renderer.listen(child, 'click', () => {
        this.renderer.removeClass(this.button.nativeElement, "active");
        this.renderer.removeClass(this.navLinks.nativeElement, "show");
      });
    }
  }
}
