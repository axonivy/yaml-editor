import { BasicField, BasicSelect, Input } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { treeNodeValueAttribute } from '../../../utils/tree/types';
import { PasswordInput } from '../../input/PasswordInput';
import { isEnumMetadata } from '../data/metadata';
import type { Variable, VariableUpdates } from '../data/variable';

type ValueProps = {
  variable: Variable;
  onChange: (updates: VariableUpdates) => void;
};

export const Value = ({ variable, onChange }: ValueProps) => {
  const enumSelectItems = useMemo(() => {
    const metadata = variable.metadata;
    if (!isEnumMetadata(metadata)) {
      return [];
    }
    return metadata.values.filter(value => value !== '').map(value => ({ label: value, value: value }));
  }, [variable]);

  const input = () => {
    switch (variable.metadata.type) {
      case 'password':
        return (
          <PasswordInput
            value={variable.value}
            onChange={(newValue: string) => onChange([{ key: treeNodeValueAttribute, value: newValue }])}
          />
        );
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
          <BasicSelect
            value={variable.value}
            items={enumSelectItems}
            emptyItem={true}
            onValueChange={(value: string) => onChange([{ key: treeNodeValueAttribute, value: value }])}
          />
        );
      default:
        return (
          <Input
            value={variable.value}
            onChange={event => onChange([{ key: treeNodeValueAttribute, value: event.target.value }])}
            autoFocus={variable.value.length === 0}
          />
        );
    }
  };

  return <BasicField label='Value'>{input()}</BasicField>;
};
