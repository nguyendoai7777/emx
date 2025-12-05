import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollExample } from './scroll-example';

describe('ScrollExample', () => {
  let component: ScrollExample;
  let fixture: ComponentFixture<ScrollExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollExample],
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollExample);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
