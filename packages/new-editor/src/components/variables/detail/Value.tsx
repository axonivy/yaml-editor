import { Fieldset, Input, SimpleSelect } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { treeNodeValueAttribute } from '../../../utils/tree/types';
import type { Variable, VariableUpdates } from '../data/variable';
import { isEnumMetadata } from '../data/variable';

type ValueFieldsetProps = {
  variable: Variable;
  onChange: (updates: VariableUpdates) => void;
};

export const Value = ({ variable, onChange }: ValueFieldsetProps) => {
  const enumSelectItems = useMemo(() => {
    const metadata = variable.metadata;
    if (!isEnumMetadata(metadata)) {
      return [];
    }
    return metadata.values.filter(value => value !== '').map(value => ({ label: value, value: value }));
  }, [variable]);

  const input = () => {
    switch (variable.metadata.type) {
      case 'daytime':
        return (
          <Input
            value={variable.value}
            onChange={event => onChange([{ key: treeNodeValueAttribute, value: event.target.value }])}
            type='time'
          />
        );
      case 'enum':
        return (
          <SimpleSelect
            value={variable.value}
            items={enumSelectItems}
            emptyItem={true}
            onValueChange={(value: string) => onChange([{ key: treeNodeValueAttribute, value: value }])}
          />
        );
      default:
        return <Input value={variable.value} onChange={event => onChange([{ key: treeNodeValueAttribute, value: event.target.value }])} />;
    }
  };

  return <Fieldset label='Value'>{input()}</Fieldset>;
};
