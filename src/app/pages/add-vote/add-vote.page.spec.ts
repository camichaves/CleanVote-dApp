import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddVotePage } from './add-vote.page';

describe('AddVotePage', () => {
  let component: AddVotePage;
  let fixture: ComponentFixture<AddVotePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVotePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddVotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
