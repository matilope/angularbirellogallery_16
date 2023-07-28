import { Component, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { AuthService } from '@shared/services/auth.service';
import { Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { User } from '@core/models/user';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { MessageService } from 'primeng/api';
import { NgIf, isPlatformBrowser } from '@angular/common';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule, NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [MessageService],
  standalone: true,
  imports: [NgIf, FormsModule, ProgressSpinnerModule, ToastModule, InputTextModule, PasswordModule]
})
export class RegisterComponent implements OnDestroy {
  public registerUserData: User;
  public subscription!: Subscription;
  public loader: boolean = false;
  public isBrowser!: boolean;

  private _auth: AuthService = inject(AuthService);
  private _messageService: MessageService = inject(MessageService);
  private router: Router = inject(Router);
  private metaService: Meta = inject(Meta);
  private platformId: object = inject(PLATFORM_ID);
  private _cookieService: CookieService = inject(CookieService);

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.registerUserData = {
      email: '',
      password: ''
    };
    this.metaService.addTag({
      name: 'robots',
      content: 'noindex, nofollow',
    });
  }

  registerUser(form: NgForm): void {
    if (form.valid) {
      this.loader = true;
      this.subscription = this._auth
        .registerUser(this.registerUserData)
        .subscribe({
          next: response => {
            if (response.status == 'Success') {
              this.loader = false;
              this._cookieService.set(environment.token, response.token, 14, "/", "", true, 'Strict');
              this._messageService.add({ severity: 'success', summary: 'Success', detail: 'User was successfully created' });
              setTimeout(() => {
                this.router.navigate(['/admin']).then(() => {
                  if ((isPlatformBrowser(this.platformId))) {
                    window.location.reload();
                  }
                });
              }, 1500);
            } else {
              this.loader = false;
              this._messageService.add({ severity: 'warn', summary: 'Warn', detail: 'User creation failed' });
            }
          },
          error: () => {
            this.loader = false;
            this._messageService.add({ severity: 'error', summary: 'Error', detail: 'User creation failed, error code 500' });
          }
        });
    } else {
      this._messageService.add({ severity: 'error', summary: 'Error', detail: 'All fields are required' });
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
