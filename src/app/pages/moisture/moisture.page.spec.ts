import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MoisturePage } from './moisture.page';

describe('MoisturePage', () => {
  let component: MoisturePage;
  let fixture: ComponentFixture<MoisturePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoisturePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MoisturePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
