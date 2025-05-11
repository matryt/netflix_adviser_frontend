import { Component } from '@angular/core';
import { SerieService } from '../../services/serie.service';
import { SeriePrediction } from '../../types/serie-prediction';
import { CustomAuthService } from '../../services/auth-service.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { SerieCardComponent } from '../serie-card/serie-card.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-prediction',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, SerieCardComponent, NgIf, NgFor],
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss']
})
export class PredictionComponent {
  predictions: SeriePrediction[] = [];
  loading: boolean = false;
  query: string = ''; // Added to store the user's custom query
  type: string = ''; // Added to store the selected type of series

  // Options for the type of series dropdown
  readonly typeOptions: string[] = ['Comédie', 'Drame', 'Science-fiction', 'Horreur', 'Action', 'Romance'];

  constructor(private serieService: SerieService, private authService: CustomAuthService) {}

  getPredictions(): void {
  if (!this.query.trim()) {
    console.error('Query is required');
    return;
  }

  this.loading = true;
  this.serieService.getPredictions(this.query).subscribe(
    (response) => {
      this.predictions = response.data.map(prediction => {
        if (prediction.serie.posterPath) {
          prediction.serie.posterPath = `https://image.tmdb.org/t/p/w500/${prediction.serie.posterPath}`;
        }
        return prediction;
      });
      this.loading = false;
    },
    (error) => {
      console.error('Error fetching predictions:', error);
      this.loading = false;
    }
  );
}
}