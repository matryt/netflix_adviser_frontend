import { Component, Input } from '@angular/core';
import { Serie } from '../../types/serie';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-serie-card',
  templateUrl: './serie-card.component.html',
  imports: [NgIf],
  styleUrls: ['./serie-card.component.scss']
})
export class SerieCardComponent {
  @Input() serie!: Serie;

  constructor() {
    console.log(this.serie?.overview);
  }
}