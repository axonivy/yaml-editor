import {
  fileMetadataFilenameExtensionOptions,
  isEnumMetadata,
  isFileMetadata,
  isFileMetadataFilenameExtension,
  isMetadataType,
  metadataOptions,
  toEnumMetadataUpdate,
  toFileMetadataUpdate
} from './metadata';

test('metadataOptions', () => {
  expect(metadataOptions).toEqual([
    { label: 'Default', value: 'default' },
    { label: 'Password', value: 'password' },
    { label: 'Daytime', value: 'daytime' },
    { label: 'Enum', value: 'enum' },
    { label: 'File', value: 'file' }
  ]);
});

test('fileMetadataFilenameExtensionOptions', () => {
  expect(fileMetadataFilenameExtensionOptions).toEqual([
    { label: 'txt', value: 'txt' },
    { label: 'json', value: 'json' }
  ]);
});

describe('isMetadataType', () => {
  describe('true', () => {
    test('empty', () => {
      expect(isMetadataType('')).toBeTruthy();
    });

    test('password', () => {
      expect(isMetadataType('password')).toBeTruthy();
    });

    test('daytime', () => {
      expect(isMetadataType('daytime')).toBeTruthy();
    });

    test('enum', () => {
      expect(isMetadataType('enum')).toBeTruthy();
    });

    test('file', () => {
      expect(isMetadataType('file')).toBeTruthy();
    });
  });

  test('false', () => {
    expect(isMetadataType('other')).toBeFalsy();
  });
});

describe('isEnumMetadata', () => {
  test('true', () => {
    expect(isEnumMetadata({ type: 'enum' })).toBeTruthy();
  });

  describe('false', () => {
    test('default', () => {
      expect(isEnumMetadata({ type: 'password' })).toBeFalsy();
    });

    test('metadataNotProvided', () => {
      expect(isEnumMetadata(undefined)).toBeFalsy();
    });
  });
});

describe('isFileMetadata', () => {
  test('true', () => {
    expect(isFileMetadata({ type: 'file' })).toBeTruthy();
  });

  describe('false', () => {
    test('default', () => {
      expect(isFileMetadata({ type: 'password' })).toBeFalsy();
    });

    test('metadataNotProvided', () => {
      expect(isFileMetadata(undefined)).toBeFalsy();
    });
  });
});

describe('isFileMetadataFilenameExtension', () => {
  describe('true', () => {
    test('txt', () => {
      expect(isFileMetadataFilenameExtension('txt')).toBeTruthy();
    });

    test('json', () => {
      expect(isFileMetadataFilenameExtension('json')).toBeTruthy();
    });
  });

  test('false', () => {
    expect(isFileMetadataFilenameExtension('other')).toBeFalsy();
  });
});

test('toEnumMetadataUpdate', () => {
  const values = ['value0', 'value1'];
  expect(toEnumMetadataUpdate(values)).toEqual({ key: 'metadata', value: { type: 'enum', values: values } });
});

test('toFileMetadataUpdate', () => {
  const filenameExtension = 'txt';
  expect(toFileMetadataUpdate(filenameExtension)).toEqual({
    key: 'metadata',
    value: { type: 'file', filenameExtension: filenameExtension }
  });
});
