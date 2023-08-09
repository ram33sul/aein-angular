import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallProfileComponent } from './small-profile.component';

describe('SmallProfileComponent', () => {
  let component: SmallProfileComponent;
  let fixture: ComponentFixture<SmallProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SmallProfileComponent]
    });
    fixture = TestBed.createComponent(SmallProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
