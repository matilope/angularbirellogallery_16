import { Component, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { Token } from '@core/models/token';
import { InstagramService } from '@shared/services/instagram.service';
import { Router, RouterLink } from '@angular/router';
import { Global } from '@global/global';
import { Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { NgIf, isPlatformBrowser } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-token-new',
  templateUrl: './token-new.component.html',
  styleUrls: ['./token-new.component.scss'],
  providers: [InstagramService, MessageService],
  standalone: true,
  imports: [RouterLink, NgIf, ReactiveFormsModule, InputTextModule, ToastModule, ProgressSpinnerModule]
})
export class TokenNewComponent implements OnInit, OnDestroy {
  public formGroup!: FormGroup;
  public token!: Token;
  public url: string;
  public subscription!: Subscription;
  public loader: boolean = false;
  public isBrowser!: boolean;

  private _instagramService: InstagramService = inject(InstagramService);
  private _messageService: MessageService = inject(MessageService);
  private metaService: Meta = inject(Meta);
  private router: Router = inject(Router);
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
    this.formGroup = new FormGroup(
      {
        token: new FormControl('', [
          Validators.required
        ])
      }
    );
  }

  onSubmit(): void {
    this.loader = true;
    this._messageService.add({ severity: 'info', summary: 'Info', detail: 'Token is being created' });
    this.subscription = this._instagramService
      .saveToken(this.token)
      .subscribe({
        next: response => {
          if (response.status == 'Success') {
            this.token = response.token;
            this.loader = false;
            this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Token was successfully created' });
            this.router.navigate(['/miscellaneous']);
          } else {
            this.loader = false;
            this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Token creation failed' });
          }
        },
        error: () => {
          this.loader = false;
          this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Token creation failed, error code 500' });
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
