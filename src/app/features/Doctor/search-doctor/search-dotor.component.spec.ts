import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDotorComponent } from './search-dotor.component';

describe('SearchDotorComponent', () => {
  let component: SearchDotorComponent;
  let fixture: ComponentFixture<SearchDotorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchDotorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchDotorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
