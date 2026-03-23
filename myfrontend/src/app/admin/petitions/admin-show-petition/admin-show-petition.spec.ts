import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminShowPetition } from './admin-show-petition';

describe('AdminShowPetition', () => {
  let component: AdminShowPetition;
  let fixture: ComponentFixture<AdminShowPetition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminShowPetition]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminShowPetition);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
