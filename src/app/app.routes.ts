import { Routes } from '@angular/router';
import { SerieManagerComponent } from './components/serie-manager/serie-manager.component';
import { AppComponent } from './app.component';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { PredictionComponent } from './components/prediction/prediction.component';

export const routes: Routes = [
  { path: 'series', component: SerieManagerComponent, canActivate: [authGuard] },
  { path: 'predictions', component: PredictionComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/series', pathMatch: 'full' },
];
