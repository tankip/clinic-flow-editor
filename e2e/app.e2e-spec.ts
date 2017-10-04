import { ClinicFlowEditorPage } from './app.po';

describe('clinic-flow-editor App', () => {
  let page: ClinicFlowEditorPage;

  beforeEach(() => {
    page = new ClinicFlowEditorPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
