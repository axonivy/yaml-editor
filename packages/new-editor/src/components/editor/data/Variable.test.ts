import { metadataOptions } from './Variable';

describe('Variable', () => {
  describe('metadataOptions', () => {
    test('allOptionsPresent', () => {
      expect(metadataOptions).toEqual([
        { label: 'None', value: 'none' },
        { label: 'Password', value: 'password' },
        { label: 'Daytime', value: 'daytime' },
        { label: 'Enum', value: 'enum' },
        { label: 'File', value: 'file' }
      ]);
    });
  });
});
