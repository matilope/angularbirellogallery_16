import { Component, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { Painting, PaintingObservable } from '@core/models/painting';
import { PaintingsService } from '@shared/services/paintings.service';
import { Router } from '@angular/router';
import { Global } from '@global/global';
import { Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { NgIf, isPlatformBrowser } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-painting-new',
  templateUrl: './painting-new.component.html',
  styleUrls: ['./painting-new.component.scss'],
  providers: [MessageService],
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, InputTextModule, InputTextareaModule, ToastModule, ProgressSpinnerModule]
})
export class PaintingNewComponent implements OnInit, OnDestroy {
  public formGroup!: FormGroup;
  public painting!: Painting;
  public url: string;
  public subscription!: Subscription;
  public selectedFileMain: File | null = null;
  public selectedFileSecond: File | null = null;
  public selectedFileThird: File | null = null;
  public loader = false;
  public isBrowser!: boolean;

  private _paintingsService: PaintingsService = inject(PaintingsService);
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
        title: new FormControl('', [
          Validators.required,
          Validators.maxLength(140)
        ]),
        subtitle: new FormControl('', [
          Validators.required,
          Validators.maxLength(140)
        ]),
        description: new FormControl('', [
          Validators.required
        ]),
        dimension: new FormControl('', [
          Validators.required,
          Validators.maxLength(140)
        ]),
        characteristics: new FormControl('', [
          Validators.required,
          Validators.maxLength(200)
        ]),
        link: new FormControl(''),
        link2: new FormControl(''),
        image0url: new FormControl(null)
      }
    );
  }

  onFileSelected(event: any, index: number): void {
    if (index === 0) {
      this.selectedFileMain = event.target.files[0];
    }
    if (index === 1) {
      this.selectedFileSecond = event.target.files[0];
    }
    if (index === 2) {
      this.selectedFileThird = event.target.files[0];
    }
  }

  onSubmit(): void {
    this.loader = true;
    this._messageService.add({ severity: 'info', summary: 'Info', detail: 'Painting is being uploaded' });
    const { title, subtitle, description, dimension, characteristics, link, link2 } = this.formGroup.value;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    formData.append('description', description);
    formData.append('dimension', dimension);
    formData.append('characteristics', characteristics);
    formData.append('link', link);
    formData.append('link2', link2);
    formData.append('image0url', this.selectedFileMain);
    formData.append('image1url', this.selectedFileSecond);
    formData.append('image2url', this.selectedFileThird);

    this.subscription = this._paintingsService.save(formData).subscribe({
      next: (response: PaintingObservable) => {
        if (response.status == 'Success') {
          this.painting = response.paint;
          this.loader = false;
          this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Painting was successfully created' });
          setTimeout(() => {
            this.router.navigate(['/admin']);
          }, 1500);
        } else {
          this.loader = false;
          this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Painting creation failed' });
        }
      },
      error: () => {
        this.loader = false;
        this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Painting creation failed, error code 500' });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
