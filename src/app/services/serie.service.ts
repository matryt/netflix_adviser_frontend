import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SerieSearch } from '../types/serie-search';
import { SeriePredictionRequest } from '../types/serie-prediction-request';
import { SeriePrediction } from '../types/serie-prediction';
import { ResponseWrapper } from '../types/response-wrapper';
import { Serie } from '../types/serie';
import { CustomAuthService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class SerieService {
  private apiUrl = 'http://localhost:8080/serie'; // Ton backend Spring Boot

  constructor(private http: HttpClient, private authService: CustomAuthService) {}

  // Méthode générique pour effectuer des requêtes HTTP avec authentification
  private authenticatedRequest<T>(method: 'GET' | 'POST', url: string, body?: any): Observable<T> {
    return new Observable<T>(observer => {
      this.authService.getAccessToken().then(token => {
        const options = {
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: body
        };

        const request$ = method === 'POST'
          ? this.http.post<T>(url, body, options)
          : this.http.get<T>(url, options);

        request$.subscribe({
          next: (response) => {
            if (response === null || response === undefined) {
              observer.next(null as unknown as T);
            } else {
              observer.next(response);
            }
            observer.complete();
          },
          error: (err) => {
            observer.error(err);
          },
          complete: () => {
            observer.complete();
          }
        });
      }).catch(err => {
        observer.error(err);
      });
    });
  }

  // Ajouter une série vue par l'utilisateur
  addSerie(tmdbId: string, note: number): Observable<ResponseWrapper<boolean>> {
    const body = { tmdbId, note };
    return this.authenticatedRequest<ResponseWrapper<boolean>>('POST', `http://localhost:8080/user/addSerie`, {"tmdbId": tmdbId, note});
  }

  // Obtenir des prédictions basées sur les séries vues
  getPredictions(request: string): Observable<ResponseWrapper<SeriePrediction[]>> {
    return this.authenticatedRequest<ResponseWrapper<SeriePrediction[]>>('POST', `${this.apiUrl}/predictSeries`, { request });
  }

  // Obtenir les séries actuelles de l'utilisateur
  getCurrentSeries(userEmail: string): Observable<ResponseWrapper<Serie[]>> {
    return this.authenticatedRequest<ResponseWrapper<Serie[]>>('POST', `${this.apiUrl}/getFromUser`, { email: userEmail });
  }

  // Autocomplétion des séries
  autocompleteSeries(query: string): Observable<ResponseWrapper<Serie[]>> {
    // Validation du paramètre
    if (!query || query.trim().length === 0) {
        throw new Error('Le paramètre de recherche est requis');
    }

    const url = `${this.apiUrl}/autocomplete?query=${encodeURIComponent(query)}`;
    return this.authenticatedRequest<ResponseWrapper<Serie[]>>( 'GET', url);
  }
}
