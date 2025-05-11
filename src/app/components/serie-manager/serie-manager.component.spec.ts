import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerieManagerComponent } from './serie-manager.component';

describe('SerieManagerComponent', () => {
  let component: SerieManagerComponent;
  let fixture: ComponentFixture<SerieManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerieManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerieManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
