import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private platformId: object = inject(PLATFORM_ID);

  clear(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
  }

  setItem(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, value);
    }
  }

  getItem(key: string): string | void {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
  }

  removeItem(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }

  key(index: number): string | void {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.key(index);
    }
  }

  length(): number | void {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.length;
    }
  }
}
