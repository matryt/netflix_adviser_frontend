import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { Serie } from '../../types/serie';
import { SerieUtilsService } from '../../services/serie-utils.service';
import { SerieService } from '../../services/serie.service';

@Component({
  selector: 'app-add-serie-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    FormsModule,
    NgForOf
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './add-serie-modal.component.html',
  styleUrls: ['./add-serie-modal.component.scss']
})
export class AddSerieModalComponent {
  selectedSerie: Serie | null = null;
  newSerie: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddSerieModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { suggestions: Serie[] },
    private serieUtils: SerieUtilsService,
    private serieService: SerieService
  ) {}

  onSerieSelected(serie: Serie): void {
    this.selectedSerie = serie;
  }

  confirmSelection(): void {
    if (this.selectedSerie) {
      this.dialogRef.close(this.selectedSerie);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  onSearchChange(query: string): void {
    if (query.length > 2) {
      this.serieService.autocompleteSeries(query).subscribe(
        (response) => {
          this.data.suggestions = response.data;
        },
        (error) => {
          console.error('Error fetching autocomplete suggestions:', error);
        }
      );
    } else {
      this.data.suggestions = [];
    }
  }

  getOverviewSnippet(overview: string): string {
    return this.serieUtils.getOverviewSnippet(overview);
  }

  onSuggestionSelected(suggestion: Serie): void {
    this.selectedSerie = suggestion;
  }

  displaySuggestion(suggestion: Serie): string {
    return suggestion && suggestion.title ? suggestion.title : '';
  }

  getFullPosterPath(posterPath: string): string {
    const baseUrl = 'https://image.tmdb.org/t/p/w500';
    return posterPath ? `${baseUrl}${posterPath}` : '';
  }
}