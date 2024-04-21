import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnBeginnnerComponent } from './learn-beginnner.component';

describe('LearnBeginnnerComponent', () => {
  let component: LearnBeginnnerComponent;
  let fixture: ComponentFixture<LearnBeginnnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LearnBeginnnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LearnBeginnnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
