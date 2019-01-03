import React from 'react';

export interface Action {
  name: string;
  args: {name: string, type: string}
}

export interface ActionMenuProps {
  component: {
    name: string;
    actions: Array<Action>;
  };
}

export class ActionMenu extends React.Component<ActionMenuProps> {
  public render() {
    const {component} = this.props;
    return (
      <div id="popper" style={{background: '#ddd', padding: '10px'}} data-component="_">
        <h3>{component.name}</h3>
        {component.actions.map(action =>
          <button onClick={() => this.recordAction(action.name)} key={action.name}>{action.name}</button>,
        )}
      </div>
    );
  }

  private recordAction = (actionName: string) => {
    const {component} = this.props;
    const action = (component.actions as Array<Action>).find((action: Action) => action.name === actionName);
    let parameters = [];

    if (action.args.length) {
      parameters = action.args.map((arg) =>
        prompt(`${arg.name}: ${arg.type}`));
    }
    console.log(`call ${component.name}.${actionName} with parameters ${JSON.stringify(parameters)}`);
  };
}
