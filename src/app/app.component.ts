import { NgIf, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, OnDestroy, PLATFORM_ID, Renderer2, ViewChild, inject } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { ScrollTopModule } from 'primeng/scrolltop';
import { HeaderComponent } from '@shared/components/header/header.component';
import { FooterComponent } from '@shared/components/footer/footer.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [NgIf, RouterOutlet, ScrollTopModule, HeaderComponent, FooterComponent]
})
export class AppComponent implements OnDestroy {
    public event: Subscription;
    public isBrowser!: boolean;
    private readonly router: Router = inject(Router);
    private readonly renderer: Renderer2 = inject(Renderer2);
    private platformId: object = inject(PLATFORM_ID);
    @ViewChild('animationRoute', { static: false }) public animationRoute: ElementRef;

    constructor() {
        this.isBrowser = isPlatformBrowser(this.platformId);
        this.event = this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this.renderer.removeClass(this.animationRoute?.nativeElement, 'router-animation');
            } else if (event instanceof NavigationEnd) {
                this.renderer.addClass(this.animationRoute?.nativeElement, 'router-animation');
            }
        });
    }

    ngOnDestroy(): void {
        this.event?.unsubscribe();
    }
}

