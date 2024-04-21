import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnIntermediateComponent } from './learn-intermediate.component';

describe('LearnIntermediateComponent', () => {
  let component: LearnIntermediateComponent;
  let fixture: ComponentFixture<LearnIntermediateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LearnIntermediateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LearnIntermediateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
