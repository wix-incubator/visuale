import {analyze} from '../src/main';

describe('analyze', () => {
  it('should analyze', () => {
    const code = `
  import someModule from './someModule';
  class ModalDriver {
 	enterText(text: string, untypedArg) {
 	    const someCode = 'happens here';
    }
  clickButton() {
      const someCode = 'happens here bla bla';
    }
} 

class DropdownDriver {
  select(index: number, isValid: boolean) {
  
  }
}
`;

    const expectedMetadata = {
      Modal: {
        name: 'Modal',
        actions: [{
          name: 'enterText',
          args: [{
            name: 'text',
            type: 'string',
          }, {
            name: 'untypedArg',
            type: 'generic'
          }],
        },
          {
            name: 'clickButton',
            args: [],
          },
        ]
      },
      Dropdown: {
        name: 'Dropdown',
        actions: [{
          name: 'select',
          args: [{
            name: 'index',
            type: 'number',
          }, {
            name: 'isValid',
            type: 'boolean',
          }],
        }]
      },
    };

    const metadata = analyze(code);
    expect(metadata).toEqual(expectedMetadata);
  });
})
;
