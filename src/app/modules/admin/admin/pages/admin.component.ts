import { Component, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { Painting } from '@core/models/painting';
import { PaintingsService } from '@shared/services/paintings.service';
import { Portrait } from '@core/models/portrait';
import { PortraitService } from '@shared/services/portrait.service';
import { Token } from '@core/models/token';
import { InstagramService } from '@shared/services/instagram.service';
import { Global } from '@global/global';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgFor, NgIf, isPlatformBrowser } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ImgBrokenDirective } from '@shared/directives/img-broken.directive';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [PaintingsService, PortraitService, InstagramService, ConfirmationService, MessageService],
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, ImgBrokenDirective, ToastModule, ConfirmDialogModule, ProgressSpinnerModule]
})
export class AdminComponent implements OnInit, OnDestroy {
  public portrait!: Portrait;
  public paintings!: Painting[];
  public token!: Token;
  public url: string;
  public subscription!: Subscription;
  public subscription2!: Subscription;
  public subscription3!: Subscription;
  public subscription4!: Subscription;
  public loaders: boolean[] = [];
  public isBrowser!: boolean;

  private _paintingsService: PaintingsService = inject(PaintingsService);
  private _portraitService: PortraitService = inject(PortraitService);
  private _instagramService: InstagramService = inject(InstagramService);
  private _confirmationService: ConfirmationService = inject(ConfirmationService);
  private _messageService: MessageService = inject(MessageService);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private metaService: Meta = inject(Meta);
  private platformId: object = inject(PLATFORM_ID);

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.url = Global.url;
    this.metaService.addTag({
      name: 'robots',
      content: 'noindex, nofollow',
    });
  }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.data.subscribe({
      next: (response: any) => {
        if (response.paintings.paints) {
          this.paintings = response.paintings.paints;
        }
      },
    });

    this.subscription2 = this._portraitService.getPortrait('64a4cb571625dd0281b55429').subscribe({
      next: response => {
        if (response.portrait) {
          this.portrait = response.portrait;
        }
      },
    });

    this.subscription3 = this._instagramService.getToken('625b1c29ac7355062c33afe1').subscribe({
      next: response => {
        if (response.token) {
          this.token = response.token;
        }
      },
    });
  }

  delete(id: string, i: number): void {
    this.loaders[i] = true;
    this._messageService.add({ severity: 'info', summary: 'Info', detail: 'Painting is being deleted' });
    this._confirmationService.confirm({
      message: 'Are you certain you want to delete the painting?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscription4 = this._paintingsService.delete(id).subscribe({
          next: (response) => {
            if (response.status == 'Success') {
              this.loaders[i] = false;
              this._messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Painting was deleted' });
              setTimeout(() => {
                this.router.navigate(['/admin']).then(() => {
                  if ((isPlatformBrowser(this.platformId))) {
                    window.location.reload();
                  }
                });
              }, 1500);
            } else {
              this.loaders[i] = false;
              this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Painting deletion failed' });
            }
          },
          error: () => {
            this.loaders[i] = false;
            this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Painting could not be deleted' });
          },
        });
      },
      reject: () => {
        this.loaders[i] = false;
        this._messageService.add({ severity: 'warn', summary: 'Rejected', detail: 'Painting was not deleted' });
      }
    });
  }

  ngOnDestroy(): void {
    [this.subscription, this.subscription2, this.subscription3, this.subscription4].forEach(e =>
      e?.unsubscribe()
    );
  }
}
