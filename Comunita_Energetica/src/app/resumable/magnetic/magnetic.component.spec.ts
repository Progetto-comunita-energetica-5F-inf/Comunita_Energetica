import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagneticComponent } from './magnetic.component';

describe('MagneticComponent', () => {
  let component: MagneticComponent;
  let fixture: ComponentFixture<MagneticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MagneticComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MagneticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
