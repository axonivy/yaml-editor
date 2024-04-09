import { getSelectedMetadataOption, metadataOptions, type Variable } from './Variable';

const variable: Variable = {
  description: '',
  metadata: '',
  name: '',
  value: '',
  children: []
};

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

    describe('getSelectedMetadataOption', () => {
      test('present', () => {
        variable.metadata = 'password';
        expect(getSelectedMetadataOption(variable)).toEqual({ label: 'Password', value: 'password' });
      });

      test('missing', () => {
        variable.metadata = 'missingMetadataOption';
        expect(getSelectedMetadataOption(variable)).toBeUndefined();
      });
    });
  });
});
