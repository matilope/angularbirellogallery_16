import { Component, OnInit, PLATFORM_ID, Optional, inject, Inject } from '@angular/core';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { isPlatformServer } from '@angular/common';
import { Response } from 'express';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  standalone: true
})
export class ErrorComponent implements OnInit {
  private platformId: object = inject(PLATFORM_ID);
  private metaService: Meta = inject(Meta);
  private router: Router = inject(Router);
  @Optional() @Inject(RESPONSE) private response: Response;

  constructor() {
    this.metaService.addTag({
      name: 'robots',
      content: 'noindex, nofollow',
    });
  }

  ngOnInit(): void {
    if (isPlatformServer(this.platformId) && this.response) {
      this.response?.status(410);
      this.response.statusCode = 410;
    }
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 3000);
  }
}
