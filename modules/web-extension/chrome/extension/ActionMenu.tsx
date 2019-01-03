import React from 'react';

interface IArg {
  name: string;
  type: 'string' | 'generic' | 'number' | 'boolean';
}

export interface IAction {
  name: string;
  args: IArg[];
}

export interface IActionMenuProps {
  component: {
    name: string;
    actions: IAction[]
  };
}

export class ActionMenu extends React.Component<IActionMenuProps> {
  public render() {
    const {component} = this.props;
    return (
      <div id="popper" style={{background: '#ddd', padding: '10px'}} data-component="_">
        <h3>{component.name}</h3>
        {component.actions.map((action: IAction) =>
          <button onClick={() => this.recordAction(action.name)} key={action.name}>{action.name}</button>,
        )}
      </div>
    );
  }

  private recordAction = (actionName: string) => {
    const {component} = this.props;
    const action = component.actions.find((anAction: IAction) => anAction.name === actionName);
    if (!action) {
      return;
    }
    let parameters: string[] = [];

    if (action.args.length) {
      parameters = action.args.map((arg) =>
        (prompt(`${arg.name}: ${arg.type}`)) || '');
    }
    console.log(`call ${component.name}.${actionName} with parameters ${JSON.stringify(parameters)}`);
  };
}
