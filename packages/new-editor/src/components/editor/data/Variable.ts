export interface Variable {
  name: string;
  value: string;
  description: string;
  metadata: string;
  children: Array<Variable>;
}

export const metadataOptions: { label: string; value: string }[] = [
  { label: 'None', value: 'none' },
  { label: 'Password', value: 'password' },
  { label: 'Daytime', value: 'daytime' },
  { label: 'Enum', value: 'enum' },
  { label: 'File', value: 'file' }
];
