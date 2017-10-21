import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWorkflowsComponent } from './view-workflows.component';

describe('ViewWorkflowsComponent', () => {
  let component: ViewWorkflowsComponent;
  let fixture: ComponentFixture<ViewWorkflowsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewWorkflowsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewWorkflowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
