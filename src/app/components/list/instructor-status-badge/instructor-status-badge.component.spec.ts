import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorStatusBadgeComponent } from './instructor-status-badge.component';

describe('InstructorStatusBadgeComponent', () => {
  let component: InstructorStatusBadgeComponent;
  let fixture: ComponentFixture<InstructorStatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorStatusBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorStatusBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
