import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotsFormComponent } from './spots-form.component';

describe('SpotsFormComponent', () => {
  let component: SpotsFormComponent;
  let fixture: ComponentFixture<SpotsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpotsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
