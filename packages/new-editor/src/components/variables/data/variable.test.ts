import { isEnumMetadata, metadataOptions, toEnumMetadataUpdate, variableMetadataAttribute } from './variable';

describe('variable', () => {
  describe('metadataOptions', () => {
    test('allOptionsPresent', () => {
      expect(metadataOptions).toEqual([
        { label: 'Password', value: 'password' },
        { label: 'Daytime', value: 'daytime' },
        { label: 'Enum', value: 'enum' },
        { label: 'File', value: 'file' }
      ]);
    });
  });

  describe('isEnumMetadata', () => {
    test('default', () => {
      expect(isEnumMetadata({ type: 'enum' })).toBeTruthy();
    });

    test('isNotEnumMetadata', () => {
      expect(isEnumMetadata({ type: 'password' })).toBeFalsy();
    });

    test('metadataNotProvided', () => {
      expect(isEnumMetadata()).toBeFalsy();
    });
  });

  test('toEnumMetadataUpdate', () => {
    const values = ['value0', 'value1'];
    expect(toEnumMetadataUpdate(values)).toEqual({ key: variableMetadataAttribute, value: { type: 'enum', values: values } });
  });
});
