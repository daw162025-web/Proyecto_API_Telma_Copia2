import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditPetition } from './admin-edit-petition';

describe('AdminEditPetition', () => {
  let component: AdminEditPetition;
  let fixture: ComponentFixture<AdminEditPetition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEditPetition]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditPetition);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
