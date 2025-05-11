import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomAuthService {
  constructor(private auth: AuthService) {}
  private accessToken: string | null = null;

  login() {
    this.auth.loginWithRedirect();
  }

  logout() {
    this.auth.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }

  getUser() {
    return this.auth.user$.pipe();
  }

  async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    const token = await firstValueFrom(
      this.auth.getAccessTokenSilently()
    );
    this.accessToken = token;
    return token;
  }

  async isAuthenticated(): Promise<boolean> {
    // Replace with actual authentication logic
    return !!(await this.getAccessToken());
  }
}

