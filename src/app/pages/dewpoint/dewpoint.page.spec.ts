import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DewpointPage } from './dewpoint.page';

describe('DewpointPage', () => {
  let component: DewpointPage;
  let fixture: ComponentFixture<DewpointPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DewpointPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DewpointPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
