import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySignatures } from './my-signatures';

describe('MySignatures', () => {
  let component: MySignatures;
  let fixture: ComponentFixture<MySignatures>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MySignatures]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MySignatures);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
