import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClockCountdownInitialComponent } from './clock-countdown-initial.component';

describe('ClockCountdownInitialComponent', () => {
  let component: ClockCountdownInitialComponent;
  let fixture: ComponentFixture<ClockCountdownInitialComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClockCountdownInitialComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClockCountdownInitialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
