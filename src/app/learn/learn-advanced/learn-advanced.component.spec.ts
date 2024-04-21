import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnAdvancedComponent } from './learn-advanced.component';

describe('LearnAdvancedComponent', () => {
  let component: LearnAdvancedComponent;
  let fixture: ComponentFixture<LearnAdvancedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LearnAdvancedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LearnAdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
