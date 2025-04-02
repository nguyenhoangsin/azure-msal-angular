import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgxJsonViewerModule],
})
export class AppComponent implements OnInit {
  #msalService = inject(MsalService);
  isAuthenticated = signal(false);
  activeAccount = signal<any>(null);

  constructor() {
    effect(() => {
      console.log('ℹ️ User status changed:', this.isAuthenticated());
    });
  }

  async ngOnInit() {
    // Handle any redirection response after login (if any)
    const res = await this.#msalService.instance.handleRedirectPromise();
    if (res) {
      console.log('✅ MSAL handle redirect promise: ', res);
    }

    // Check authentication status and active account after initializing MSAL
    this.checkAuth();
  }

  checkAuth() {
    // First, try to get the active account from MSAL instance
    let account = this.#msalService.instance.getActiveAccount();

    // If no active account is set, try to get the first account from the list of all accounts
    if (!account) {
      const accounts = this.#msalService.instance.getAllAccounts();
      account = accounts.length > 0 ? accounts[0] : null;
    }

    // If an account is found, proceed with setting the active account and acquiring a token
    if (account) {
      // Set the active account in MSAL instance to allow future interactions with this account
      this.#msalService.instance.setActiveAccount(account);

      // Attempt to acquire an access token silently (without user interaction)
      this.#msalService
        .acquireTokenSilent({
          scopes: ['user.read', 'openid', 'profile', 'email', 'offline_access'], // Define the required scopes
        })
        .subscribe({
          next: (response) => {
            // Successfully acquired the token, update UI state and store the active account
            this.isAuthenticated.set(true);
            this.activeAccount.set(account);
            console.log(
              '✅ MSAL token acquired successfully: ',
              response.accessToken
            );
          },
          error: (error) => {
            console.log('🚫 MSAL token acquisition failed', error);
            this.isAuthenticated.set(false);
          },
        });
    } else {
      this.isAuthenticated.set(false);
    }
  }

  redirectToLogin() {
    this.#msalService.loginRedirect();
  }

  redirectToLogout() {
    this.#msalService.logoutRedirect();
  }

  // Utility function to sanitize and recursively clean JSON data
  sanitizeJson(json: any): any {
    if (json === null) return undefined;
    if (typeof json === 'object') {
      // If input is an object, recursively clean its properties
      for (const key in json) {
        json[key] = this.sanitizeJson(json[key]);
      }
    }
    return json;
  }
}
