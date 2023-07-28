import { Component, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { AuthService } from '@shared/services/auth.service';
import { Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { User, UserObservable } from '@core/models/user';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { MessageService } from 'primeng/api';
import { NgIf, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService],
  standalone: true,
  imports: [NgIf, FormsModule, ProgressSpinnerModule, ToastModule, InputTextModule, PasswordModule]
})
export class LoginComponent implements OnDestroy {
  public loginUserData: User;
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
    this.loginUserData = {
      email: '',
      password: ''
    };
    this.metaService.addTag({
      name: 'robots',
      content: 'noindex, nofollow',
    });
  }

  loginUser(form: NgForm): void {
    if (form.valid) {
      this._messageService.add({ severity: 'info', summary: 'Info', detail: 'You are logging in' });
      this.loader = true;
      this.subscription = this._auth.loginUser(this.loginUserData).subscribe({
        next: (response: UserObservable) => {
          if (response.status == 'Success') {
            this._cookieService.set(environment.token, response.token, 14, "/", "", true, 'Strict');
            this.loader = false;
            this._messageService.add({ severity: 'success', summary: 'Success', detail: 'The login credentials provided are correct' });
            setTimeout(() => {
              this.router.navigate(['/admin']).then(() => {
                if ((isPlatformBrowser(this.platformId))) {
                  window.location.reload();
                }
              });
            }, 1500);
          } else {
            this.loader = false;
            this._messageService.add({ severity: 'warn', summary: 'Warn', detail: 'The login credentials are not correct' });
          }
        },
        error: () => {
          this.loader = false;
          this._messageService.add({ severity: 'error', summary: 'Error', detail: 'User authentication failed, error code 404' });
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
