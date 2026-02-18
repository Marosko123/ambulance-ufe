import { newSpecPage } from '@stencil/core/testing';
import { MbAmbulanceWlList } from '../mb-ambulance-wl-list';

describe('mb-ambulance-wl-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MbAmbulanceWlList],
      html: `<mb-ambulance-wl-list></mb-ambulance-wl-list>`,
    });
    expect(page.root).toEqualHtml(`
      <mb-ambulance-wl-list>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </mb-ambulance-wl-list>
    `);
  });
});
