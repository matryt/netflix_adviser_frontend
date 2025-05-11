import {Component, HostListener, OnInit, ViewEncapsulation} from '@angular/core';
import {CustomAuthService} from '../../services/auth-service.service';
import {SerieService} from '../../services/serie.service';
import {FormsModule} from '@angular/forms';
import {Serie} from '../../types/serie';
import {NgForOf, NgIf} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { AddSerieModalComponent } from '../add-serie-modal/add-serie-modal.component';
import { SerieUtilsService } from '../../services/serie-utils.service';
import { SerieCardComponent } from '../serie-card/serie-card.component';

@Component({
  selector: 'app-serie-manager',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    MatFormFieldModule,
    MatAutocompleteModule,
    FormsModule,
    MatInputModule,
    SerieCardComponent
  ],
  templateUrl: './serie-manager.component.html',
  styleUrls: ['./serie-manager.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SerieManagerComponent implements OnInit {
  userEmail: string | undefined;
  currentSeries: Serie[] = [];
  newSerie: string = '';
  predictionRequest: string = ''; 
  suggestions: Serie[] = [];
  selectedSuggestion: Serie | null = null;
  isWideScreen: boolean = true;

  constructor(private authService: CustomAuthService, private serieService: SerieService, private dialog: MatDialog, private serieUtils: SerieUtilsService) {}

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      console.log(user);
      this.userEmail = user?.email ?? '';
      this.loadCurrentSeries();
    });
    this.checkScreenWidth();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenWidth();
  }

  private checkScreenWidth(): void {
    this.isWideScreen = window.innerWidth > 768;
  }

  openModal(): void {
    const dialogRef = this.dialog.open(AddSerieModalComponent, {
      width: '400px',
      data: { suggestions: this.suggestions }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Modal result:', result);
        this.addSerieFromModal(result);
      }
    });
  }

  addSerieFromModal(selectedSerie: Serie): void {
    this.selectedSuggestion = selectedSerie;
    this.addSerie();
  }

  onSuggestionSelected(suggestion: Serie): void {
    this.selectedSuggestion = suggestion;
  }

  addSerie(): void {
    if (this.selectedSuggestion) {
      console.log('Adding series:', this.selectedSuggestion);
      const tmdbId = this.selectedSuggestion.tmdbId; // Extract tmdbId from the selected suggestion
      const note = 5; // Default note value, can be replaced with user input
      this.serieService.addSerie(tmdbId, note).subscribe(
        response => {
          if (response.status === 'success') {
            console.log('Series added successfully');
            this.newSerie = '';
            this.selectedSuggestion = null; // Reset the selected suggestion
            this.loadCurrentSeries(); // Refresh the list of current series
          } else {
            console.error('Error:', response.error);
          }
        },
        error => {
          console.error('Error adding series:', error);
        }
      );
    } else {
      console.error('No series selected.');
    }
  }

  loadCurrentSeries() {
    if (this.userEmail) {
      console.log('userEmail', this.userEmail);
      this.serieService.getCurrentSeries(this.userEmail).subscribe(response => {
        if (response && response.data) {
            this.currentSeries = response.data.map(serie => {
              if (serie.posterPath) {
                serie.posterPath = `https://image.tmdb.org/t/p/w500/${serie.posterPath}`;
              }
              return serie;
            });
        }
      });
    }
  }

  onSearchChange(query: string): void {
    if (query.length > 2) {
      this.serieService.autocompleteSeries(query).subscribe(
        (response) => {
          this.suggestions = response.data;
        },
        (error) => {
          console.error('Error fetching autocomplete suggestions:', error);
        }
      );
    } else {
      this.suggestions = [];
    }
  }

  displaySuggestion(suggestion: Serie): string {
    return suggestion && suggestion.title ? suggestion.title : '';
  }

  getOverviewSnippet(overview: string): string {
    return this.serieUtils.getOverviewSnippet(overview);
  }

  getFullPosterPath(posterPath: string): string {
    const baseUrl = 'https://image.tmdb.org/t/p/w500';
    return posterPath ? `${baseUrl}${posterPath}` : '';
  }
}
