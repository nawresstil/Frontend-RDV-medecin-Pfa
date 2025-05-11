import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarbarAdminComponent } from './sidebarbar-admin.component';

describe('SidebarbarAdminComponent', () => {
  let component: SidebarbarAdminComponent;
  let fixture: ComponentFixture<SidebarbarAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarbarAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarbarAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
