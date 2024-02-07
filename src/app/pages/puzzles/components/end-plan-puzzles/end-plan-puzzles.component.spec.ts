import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EndPlanPuzzlesComponent } from './end-plan-puzzles.component';

describe('EndPlanPuzzlesComponent', () => {
  let component: EndPlanPuzzlesComponent;
  let fixture: ComponentFixture<EndPlanPuzzlesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EndPlanPuzzlesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EndPlanPuzzlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
