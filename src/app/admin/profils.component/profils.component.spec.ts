import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilsComponent } from './profils.component';

describe('ProfilsComponent', () => {
  let component: ProfilsComponent;
  let fixture: ComponentFixture<ProfilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
