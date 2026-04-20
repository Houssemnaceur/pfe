import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagasinViewComponent } from './magasin-view.component';

describe('MagasinViewComponent', () => {
  let component: MagasinViewComponent;
  let fixture: ComponentFixture<MagasinViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MagasinViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MagasinViewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
