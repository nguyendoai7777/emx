import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogViewer } from './dialog-viewer';

describe('DialogViewer', () => {
  let component: DialogViewer;
  let fixture: ComponentFixture<DialogViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogViewer],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogViewer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
