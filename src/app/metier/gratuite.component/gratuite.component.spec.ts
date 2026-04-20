import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GratuiteComponent } from './gratuite.component';

describe('GratuiteComponent', () => {
  let component: GratuiteComponent;
  let fixture: ComponentFixture<GratuiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GratuiteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GratuiteComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
