import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FinddevicePage } from './finddevice.page';

describe('FinddevicePage', () => {
  let component: FinddevicePage;
  let fixture: ComponentFixture<FinddevicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinddevicePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FinddevicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
