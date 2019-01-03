import { types as t } from '@babel/core';
import { parse as babelParse } from '@babel/parser';
import traverse, { Node, NodePath } from '@babel/traverse';

function extractParamType(param: any): string {
  const paramType = param.typeAnnotation && param.typeAnnotation.typeAnnotation && param.typeAnnotation.typeAnnotation.type;
  if (!paramType) {
    return 'generic';
  }

  return paramType.replace(/TypeAnnotation$/, '').replace(/TS(.+)Keyword/, '$1').toLowerCase();
}

const parse = (code: string) => {
  return babelParse(code, {
    sourceType: 'module',
    plugins: ['typescript'],
  });
};

const extract = (ast: Node) => {
  const metadata = {};

  const visitClassMethod = {
    ClassMethod(path: NodePath<t.ClassMethod>) {
      const { params } = path.node;
      // tslint:disable-next-line no-invalid-this
      metadata[this.componentName].actions.push({
        name: (path.node.key as any).name,
        args: params.map((param: any) => ({
          name: param.name,
          type: extractParamType(param),
        })),
      });
    },
  };

  traverse(ast, {
    ClassDeclaration: {
      enter(path: NodePath<t.ClassDeclaration>) {
        const name = path.node.id.name.replace(/driver$/i, '');
        metadata[name] = {name, actions: []};
        path.traverse(visitClassMethod, { componentName: name });
      },
    },
  });

  return metadata;
};


export const analyze = (code: string) => {
  return extract(parse(code));
};
