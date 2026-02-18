import { newSpecPage } from '@stencil/core/testing';
import { MbAmbulanceWlList } from '../mb-ambulance-wl-list';

describe('mb-ambulance-wl-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MbAmbulanceWlList],
      html: `<mb-ambulance-wl-list></mb-ambulance-wl-list>`,
    });
    const wlList = page.rootInstance as MbAmbulanceWlList;
    const expectedPatients = wlList?.waitingPatients?.length

    const items = page.root.shadowRoot.querySelectorAll("md-list-item");
    expect(items.length).toEqual(expectedPatients);
  });
});
