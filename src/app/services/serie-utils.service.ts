import { Injectable } from '@angular/core';
import { Serie } from '../types/serie';

@Injectable({
  providedIn: 'root'
})
export class SerieUtilsService {
  getOverviewSnippet(overview: string): string {
    if (!overview) {
      return '';
    }
    return overview.length > 100 ? overview.substring(0, 100) + '...' : overview;
  }

  filterSuggestions(query: string, suggestions: Serie[]): Serie[] {
    if (query.length > 2) {
      return suggestions.filter(suggestion =>
        suggestion.title.toLowerCase().includes(query.toLowerCase())
      );
    }
    return [];
  }
}