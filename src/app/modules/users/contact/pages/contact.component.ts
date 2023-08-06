import { Component, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { ContactService } from '@shared/services/contact.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { Global } from '@global/global';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { NgIf, isPlatformBrowser } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  providers: [MessageService],
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, InputTextModule, InputTextareaModule, DropdownModule, ToastModule, ProgressSpinnerModule]
})

export class ContactComponent implements OnInit, OnDestroy {
  public formGroup!: FormGroup;
  public url: string;
  private subscription!: Subscription;
  private subscription2!: Subscription;
  public titles!: string[];
  public loader = false;
  public isBrowser!: boolean;

  private _contactService: ContactService = inject(ContactService);
  private _messageService: MessageService = inject(MessageService);
  private platformId: object = inject(PLATFORM_ID);
  private metaService: Meta = inject(Meta);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.metaService.updateTag({
      name: 'title',
      content: 'Birello Gallery | Contact',
    });
    this.metaService.updateTag({
      name: 'description',
      content: 'Contact us, +54-911-6481-6622 | ignaciobirello@hotmail.com',
    });
    this.metaService.updateTag({
      property: 'og:title',
      content: 'Birello Gallery | Contact',
    });
    this.metaService.updateTag({
      property: 'og:description',
      content: 'Contact us, +54-911-6481-6622 | ignaciobirello@hotmail.com',
    });
    this.metaService.updateTag({
      property: 'og:url',
      content: 'https://www.birellogallery.com/contact',
    });
    this.metaService.updateTag({
      property: 'twitter:title',
      content: 'Birello Gallery | Contact',
    });
    this.metaService.updateTag({
      property: 'twitter:description',
      content: 'Contact us, +54-911-6481-6622 | ignaciobirello@hotmail.com',
    });
    this.metaService.updateTag({
      property: 'twitter:url',
      content: 'https://www.birellogallery.com/contact',
    });
    this.url = Global.url;
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup(
      {
        name: new FormControl('', [
          Validators.required
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.email
        ]),
        subject: new FormControl('', [
          Validators.required
        ]),
        paint: new FormControl('', [
          Validators.required
        ]),
        textarea: new FormControl('', [
          Validators.required
        ])
      }
    );
    this.subscription = this.activatedRoute.data.subscribe({
      next: response => {
        if (response.paintings.paints) {
          this.titles = response.paintings.paints.map((e: { title: string; }) => { return e.title });
          this.titles.unshift("Select a painting *");
        }
      },
    });
  }

  contactForm(): void {
    this.loader = true;
    this._messageService.add({ severity: 'info', summary: 'Info', detail: 'Your message is being sent' });
    const data = this.formGroup.value;
    this.subscription2 = this._contactService.getContacts(data).subscribe({
      next: () => {
        if (data.name && data.email && data.subject && data.paint && data.textarea) {
          this.loader = false;
          this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Your message was sent' });
          this.router.navigate(['/']);
        } else {
          this.loader = false;
          this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Your message was not sent' });
        }
      },
    });
  }

  ngOnDestroy(): void {
    [this.subscription, this.subscription2].forEach(e => e?.unsubscribe());
  }
}
