import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorsFormComponent } from './instructors-form.component';

describe('InstructorsFormComponent', () => {
  let component: InstructorsFormComponent;
  let fixture: ComponentFixture<InstructorsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
