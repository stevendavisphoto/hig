
import { mount } from 'enzyme';
import * as HIG from 'hig-vanilla';
import React from 'react';

import IconButtonAdapter from './IconButtonAdapter';

describe('<IconButtonAdapter>', () => {
  /**
     * Creates a hig-vanilla button and returns the instance and it's container
     *
     * @param {object} defaults hig-vanilla defaults for the button
     */
  function createHigButton(defaults = {}) {
    const higContainer = document.createElement('div');

    // use spread here to clone defaults since HIG.Button mutates this object
    const higButton = new HIG.IconButton({ ...defaults });

    higButton.mount(higContainer);

    return { higButton, higContainer };
  }

  it('renders the icon button with initial props', () => {
    const defaults = {
      title: 'icon button',
      link: 'http://example.com',
      icon: 'gear'
    };

    const { higButton, higContainer } = createHigButton(defaults);
    const container = document.createElement('div');

    const wrapper = mount(<IconButtonAdapter {...defaults} />, {
      attachTo: container
    });

    expect(container.firstElementChild.outerHTML).toMatchSnapshot();

    expect(container.firstElementChild.outerHTML).toEqual(
      higContainer.firstElementChild.outerHTML
    );
  });

  it('renders the icon button with updated props', () => {
    const defaults = {
      icon: 'gear'
    };

    const { higButton, higContainer } = createHigButton(defaults);
    const container = document.createElement('div');

    const wrapper = mount(<IconButtonAdapter {...defaults} />, {
      attachTo: container
    });

    const nextProps = {
      title: 'icon button',
      link: 'http://example.com',
      icon: 'assets',
      disabled: true
    };

    higButton.setTitle(nextProps.title);
    higButton.setLink(nextProps.link);
    higButton.setIcon(nextProps.icon);
    higButton.disable();
    wrapper.setProps(nextProps);

    expect(container.firstElementChild.outerHTML).toMatchSnapshot();

    expect(container.firstElementChild.outerHTML).toEqual(
      higContainer.firstElementChild.outerHTML
    );
  });

  it('renders the disabled icon button', () => {
    const defaults = {
      title: 'icon button',
      link: 'http://example.com',
      icon: 'gear',
      disabled: true
    };

    const { higButton, higContainer } = createHigButton(defaults);
    const container = document.createElement('div');
    higButton.disable();

    const wrapper = mount(<IconButtonAdapter {...defaults} />, {
      attachTo: container
    });

    expect(container.firstElementChild.outerHTML).toMatchSnapshot();

    expect(container.firstElementChild.outerHTML).toEqual(
      higContainer.firstElementChild.outerHTML
    );
  });

  ['onBlur', 'onClick', 'onFocus', 'onHover'].forEach(eventName => {
    it(`sets event listeners for ${eventName} initially`, () => {
      const spy = jest.fn();
      const container = document.createElement('div');
      const wrapper = mount(
        <IconButtonAdapter icon="gear" {...{ [eventName]: spy }} />,
        {
          attachTo: container
        }
      );
      const instance = wrapper.instance().instance;

      const disposeFunction = instance._disposeFunctions.get(
        eventName + 'Dispose'
      );
      expect(disposeFunction).toBeDefined();
    });

    it(`sets event listeners for ${eventName} when updated`, () => {
      const spy = jest.fn();
      const container = document.createElement('div');
      const wrapper = mount(<IconButtonAdapter icon="gear" />, {
        attachTo: container
      });
      wrapper.setProps({ [eventName]: spy });

      const instance = wrapper.instance().instance;

      const disposeFunction = instance._disposeFunctions.get(
        `${eventName}Dispose`
      );
      expect(disposeFunction).toBeDefined();
    });
  });
});