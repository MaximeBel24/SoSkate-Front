import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoCardsGroupComponent } from './info-cards-group.component';

describe('InfoCardsGroupComponent', () => {
  let component: InfoCardsGroupComponent;
  let fixture: ComponentFixture<InfoCardsGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoCardsGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoCardsGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
