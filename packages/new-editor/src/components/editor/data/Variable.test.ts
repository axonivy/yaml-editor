import {
  asEnumMetadata,
  metadataOptions,
  metadataTypeDaytime,
  metadataTypeEnum,
  metadataTypeFile,
  metadataTypePassword,
  toEnumMetadataUpdate,
  variableMetadataAttribute,
  type EnumMetadata
} from './Variable';

describe('variable', () => {
  describe('metadataOptions', () => {
    test('allOptionsPresent', () => {
      expect(metadataOptions).toEqual([
        { label: 'Password', value: metadataTypePassword },
        { label: 'Daytime', value: metadataTypeDaytime },
        { label: 'Enum', value: metadataTypeEnum },
        { label: 'File', value: metadataTypeFile }
      ]);
    });
  });

  describe('asEnumMetadata', () => {
    test('default', () => {
      const enumMetadata = asEnumMetadata({ type: metadataTypeEnum });
      expect(enumMetadata).toBeDefined();
      if (enumMetadata) {
        expectTypeOf(enumMetadata).toEqualTypeOf<EnumMetadata>();
      }
    });

    test('isNotEnumMetadata', () => {
      expect(asEnumMetadata({ type: metadataTypePassword })).toBeUndefined();
    });

    test('metadataNotProvided', () => {
      expect(asEnumMetadata()).toBeUndefined();
    });
  });

  test('toEnumMetadataUpdate', () => {
    const values = ['value0', 'value1'];
    expect(toEnumMetadataUpdate(values)).toEqual({ key: variableMetadataAttribute, value: { type: metadataTypeEnum, values: values } });
  });
});
