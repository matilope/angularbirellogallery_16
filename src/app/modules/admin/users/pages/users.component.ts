import { Component, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { User } from '@core/models/user';
import { AdminService } from '@shared/services/admin.service';
import { Global } from '@global/global';
import { Router, RouterLink } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgFor, NgIf, isPlatformBrowser } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [AdminService, MessageService, ConfirmationService],
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, ToastModule, ConfirmDialogModule, ProgressSpinnerModule]
})
export class UsersComponent implements OnInit, OnDestroy {
  public users!: User[];
  public url: string;
  public subscription!: Subscription;
  public subscription2!: Subscription;
  public loaders: boolean[] = [];
  public isBrowser!: boolean;

  private _adminService: AdminService = inject(AdminService);
  private _messageService: MessageService = inject(MessageService);
  private _confirmationService: ConfirmationService = inject(ConfirmationService);
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
    this.subscription = this._adminService.getUsers().subscribe({
      next: response => {
        if (response) {
          this.users = response.users;
        }
      },
    });
  }

  deleteUser(id: string, i: number): void {
    this.loaders[i] = true;
    this._messageService.add({ severity: 'info', summary: 'Info', detail: 'User is being deleted' });
    this._confirmationService.confirm({
      message: 'Are you certain you want to delete this user?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscription2 = this._adminService.deleteUser(id).subscribe({
          next: (response) => {
            if (response.status == 'Success') {
              this.loaders[i] = false;
              this._messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'User was deleted' });
              setTimeout(() => {
                this.router.navigate(['/admin']).then(() => {
                  if ((isPlatformBrowser(this.platformId))) {
                    window.location.reload();
                  }
                });
              }, 1500);
            } else {
              this.loaders[i] = false;
              this._messageService.add({ severity: 'error', summary: 'Error', detail: 'User deletion failed' });
            }
          },
          error: () => {
            this.loaders[i] = false;
            this._messageService.add({ severity: 'error', summary: 'Error', detail: 'User could not be deleted' });
          },
        });
      },
      reject: () => {
        this.loaders[i] = false;
        this._messageService.add({ severity: 'warn', summary: 'Rejected', detail: 'User was not deleted' });
      }
    });
  }

  ngOnDestroy(): void {
    [this.subscription, this.subscription2].forEach(e => e?.unsubscribe());
  }
}
