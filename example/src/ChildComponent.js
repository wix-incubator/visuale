import React from 'react';

export class ChildComponent extends React.Component {
  render () {
    return (
      <div style={{background: 'green', padding: '5px', width: '300px'}} data-component="ChildComponent">
          <span>i'm just a child!</span>
      </div>
    );
  }
}