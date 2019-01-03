import React from 'react';
import ReactDOM from 'react-dom';
import Popper from 'popper.js';
import { ActionMenu } from './ActionMenu.tsx';

const componentMap = {
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

function registerInspector () {
  function findReactComponentName (instance) {
    if (instance.return && instance.return.elementType && !instance.return.elementType.name) {
      return findReactComponentName(instance.return);
    }
    return instance.return.elementType && instance.return.elementType.name;
  }

  function findDOMComponentName (el) {
    const componentName = el && el.getAttribute('data-component');
    if (componentName === '_') {
      return null;
    }
    if (componentName) {
      return componentName;
    }
    return findDOMComponentName(el.parentElement);
  }

  function findReactInstance (el) {
    let instance;
    for (const key of Object.keys(el)) {
      if (key.startsWith('__reactInternalInstance$')) {
        instance = el[key];
        break;
      }
    }

    if (!instance) {
      return;
    }
    return findReactComponentName(instance);
  }

  let lastElement = null;
  let lastComponent = null;

  document.body.addEventListener('click', (e) => {
    const {target} = e;

    if (lastElement === target) {
      return;
    }
    lastElement = target;

    const name = findDOMComponentName(target);

    if (!name || !componentMap[name]) {
      return;
    }

    const component = componentMap[name];
    if (lastComponent === component) {
      return;
    }
    lastComponent = component;

    console.log(`these are the available actions for ${name}`, Object.keys(component.actions));
    ReactDOM.render(<ActionMenu component={component}/>, document.getElementById('popover'));
    (new Popper(target, document.querySelector('#popper'), {
      placement: 'right',
    }));
  });
};

registerInspector();

