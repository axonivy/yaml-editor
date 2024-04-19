import type { EnumMetadata, FileMetadata } from '../metadata';
import type { Variable } from '../variable';

export const contentWithMetadata = `Variables:
  # [password]
  passwordKey: passwordValue
  # [daytime]
  daytimeKey: 08:00
  # [enum: value0, value1, value2]
  enumKey: value1
  # [file: json]
  fileKey: fileValue
`;
export const variablesWithMetadata: Array<Variable> = [
  {
    name: 'passwordKey',
    value: 'passwordValue',
    description: '',
    metadata: { type: 'password' },
    children: []
  },
  {
    name: 'daytimeKey',
    value: '08:00',
    description: '',
    metadata: { type: 'daytime' },
    children: []
  },
  {
    name: 'enumKey',
    value: 'value1',
    description: '',
    metadata: { type: 'enum', values: ['value0', 'value1', 'value2'] } as EnumMetadata,
    children: []
  },
  {
    name: 'fileKey',
    value: 'fileValue',
    description: '',
    metadata: { type: 'file', filenameExtension: 'json' } as FileMetadata,
    children: []
  }
];
