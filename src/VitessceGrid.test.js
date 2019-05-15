import expect from 'expect';
import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { resolveLayout, VitessceGrid } from './VitessceGrid';

configure({ adapter: new Adapter() });

describe('VitessceGrid.js', () => {
  describe('resolveLayout', () => {
    const componentsSpec = [
      { component: 'NoProps', x: 0, y: 0 },
      {
        component: 'HasProps', props: { foo: 'bar' }, x: 1, y: 1, w: 1, h: 1,
      },
    ];
    const expectedComponents = {
      r0_c0: {
        component: 'NoProps',
        props: {},
      },
      r1_c1: {
        component: 'HasProps',
        props: {
          foo: 'bar',
        },
      },
    };

    it('handles responsive', () => {
      const {
        cols, layouts, breakpoints, components,
      } = resolveLayout({
        columns: {
          1000: [0, 3, 9, 12],
          800: [0, 4, 8, 12],
        },
        components: componentsSpec,
      });
      expect(cols).toEqual({ 800: 12, 1000: 12 });
      expect(layouts).toEqual(
        {
          800: [
            {
              h: 1, i: 'r0_c0', w: 4, x: 0, y: 0,
            },
            {
              h: 1, i: 'r1_c1', w: 4, x: 4, y: 1,
            },
          ],
          1000: [
            {
              h: 1, i: 'r0_c0', w: 3, x: 0, y: 0,
            },
            {
              h: 1, i: 'r1_c1', w: 6, x: 3, y: 1,
            },
          ],
        },
      );
      expect(breakpoints).toEqual({
        800: '800',
        1000: '1000',
      });
      expect(components).toEqual(expectedComponents);
    });

    it('handles static', () => {
      const {
        cols, layouts, breakpoints, components,
      } = resolveLayout(
        componentsSpec,
      );
      expect(cols).toEqual({ ID: 12 });
      expect(layouts).toEqual(
        {
          ID: [
            {
              h: 1, i: 'r0_c0', w: 1, x: 0, y: 0,
            },
            {
              h: 1, i: 'r1_c1', w: 1, x: 1, y: 1,
            },
          ],
        },
      );
      expect(breakpoints).toEqual({ ID: 1000 });
      expect(components).toEqual(expectedComponents);
    });
  });

  describe('<VitessceGrid />', () => {
    it('works', () => {
      function FakeComponent() {}
      /* eslint-disable object-curly-newline */
      /* eslint-disable object-property-newline */
      const layoutJson = {
        columns: {
          600: [0, 2, 4, 8],
        },
        components: [
          { component: 'FakeComponent',
            props: { text: 'header' },
            x: 0, y: 0, w: 2 },
        ],
      };
      /* eslint-enable */

      const wrapper = shallow(<VitessceGrid
        layout={layoutJson}
        getComponent={() => FakeComponent}
        draggableHandle=".fakeClass"
      />);

      expect(wrapper.find('div').length).toEqual(1);
    });
  });
});
