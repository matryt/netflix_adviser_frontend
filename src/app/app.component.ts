import { Component } from '@angular/core';
import {AsyncPipe, NgIf} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {CustomAuthService} from './services/auth-service.service';
import { MenuComponent } from "./components/menu/menu.component";
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    AsyncPipe,
    NgIf,
    RouterOutlet,
    MenuComponent
],
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public auth: CustomAuthService) {
    this.auth.getUser().subscribe(user => console.log(user));
  }

  login() {
    this.auth.login();
  }

  logout() {
    this.auth.logout();
  }
}
