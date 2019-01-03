import Popper from 'popper.js';
import React from 'react';
import ReactDOM from 'react-dom';
import {ActionMenu, IAction} from './ActionMenu';

export interface IComponent {
  name: string;
  actions: IAction[];
}

const componentMap: Record<string, IComponent> = {
  MyComponent: {
    name: 'MyComponent',
    actions: [{
      name: 'enterText',
      args: [{
        name: 'text',
        type: 'string',
      }],
    },
      {
        name: 'clickButton',
        args: [],
      },
    ],
  },
  ChildComponent: {
    name: 'ChildComponent',
    actions: [{
      name: 'select',
      args: [{
        name: 'index',
        type: 'number',
      }, {
        name: 'isValid',
        type: 'boolean',
      }],
    }],
  },
};

function registerInspector() {
  function findReactComponentName(instance: any): string {
    if (instance.return && instance.return.elementType && !instance.return.elementType.name) {
      return findReactComponentName(instance.return);
    }
    return instance.return.elementType && instance.return.elementType.name;
  }

  function findDOMComponentName(el: HTMLElement | null): string | null {
    if (!el) {
      return null;
    }
    const componentName = el && el.getAttribute('data-component');
    if (componentName === '_') {
      return null;
    }
    if (componentName) {
      return componentName;
    }
    return findDOMComponentName(el.parentElement);
  }

  function findReactInstance(el: HTMLElement) {
    let instance;
    for (const key of Object.keys(el)) {
      if (key.startsWith('__reactInternalInstance$')) {
        instance = (el as any)[key];
        break;
      }
    }

    if (!instance) {
      return;
    }
    return findReactComponentName(instance);
  }

  let lastElement: HTMLElement | null = null;
  let lastComponent: IComponent | null = null;

  document.body.addEventListener('click', (e) => {
    const {target} = e;
    if (!target || lastElement === target) {
      return;
    }
    lastElement = target as HTMLElement;

    const name = findDOMComponentName(lastElement);

    if (!name || !componentMap[name]) {
      return;
    }

    const component = componentMap[name];
    if (lastComponent === component) {
      return;
    }
    lastComponent = component;

    console.log(`these are the available actions for ${name}`, component.actions.map((action: IAction) => action.name));
    ReactDOM.render(<ActionMenu component={component}/>, document.getElementById('popover'));
    const popper = new Popper(lastElement, document.querySelector('#popper') as Element, {
      placement: 'right',
    });
  });
}

registerInspector();
