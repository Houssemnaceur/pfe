import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VuesComponent } from './vues.component';

describe('VuesComponent', () => {
  let component: VuesComponent;
  let fixture: ComponentFixture<VuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VuesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VuesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
