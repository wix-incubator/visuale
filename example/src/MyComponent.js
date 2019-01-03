import React from 'react';
import { ChildComponent } from './ChildComponent';

export class MyComponent extends React.Component {
  render () {
    return (
      <div style={{background: 'red', padding: '5px', width: '400px'}} data-component="MyComponent">
        <div>
          <span>Welcome to my component!</span>
        </div>
        <div>
          <button>click a button</button>
        </div>
        <div>
          <input placeholder="enter text here..."/>
        </div>
        <ChildComponent/>
      </div>
    );
  }
}