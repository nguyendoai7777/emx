import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NamedTimeline } from './named-timeline';

describe('NamedTimeline', () => {
  let component: NamedTimeline;
  let fixture: ComponentFixture<NamedTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NamedTimeline],
    }).compileComponents();

    fixture = TestBed.createComponent(NamedTimeline);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
