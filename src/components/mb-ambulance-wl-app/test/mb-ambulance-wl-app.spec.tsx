import { newSpecPage } from '@stencil/core/testing';
import { MbAmbulanceWlApp } from '../mb-ambulance-wl-app';

describe('mb-ambulance-wl-app', () => {

  it('renders editor', async () => {
    const page = await newSpecPage({
      url: `http://localhost/entry/@new`,
      components: [MbAmbulanceWlApp],
      html: `<mb-ambulance-wl-app base-path="/"></mb-ambulance-wl-app>`,
    });
    page.win.navigation = new EventTarget()
    const child = await page.root.shadowRoot.firstElementChild;
    expect(child.tagName.toLocaleLowerCase()).toEqual ("mb-ambulance-wl-editor");

  });

  it('renders list', async () => {
    const page = await newSpecPage({
      url: `http://localhost/ambulance-wl/`,
      components: [MbAmbulanceWlApp],
      html: `<mb-ambulance-wl-app base-path="/ambulance-wl/"></mb-ambulance-wl-app>`,
    });
    page.win.navigation = new EventTarget()
    const child = await page.root.shadowRoot.firstElementChild;
    expect(child.tagName.toLocaleLowerCase()).toEqual("mb-ambulance-wl-list");
  });
});
