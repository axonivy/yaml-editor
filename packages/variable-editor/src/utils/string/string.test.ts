import { getLastLine, removeLeadingWhitespacesFromEachLine } from './string';

describe('string', () => {
  describe('removeLeadingWhitespacesFromEachLine', () => {
    test('empty', () => {
      expect(removeLeadingWhitespacesFromEachLine('')).toEqual('');
    });

    describe('whitespaceOnly', () => {
      test('singleLine', () => {
        expect(removeLeadingWhitespacesFromEachLine('   ')).toEqual('');
      });

      test('multiLine', () => {
        expect(removeLeadingWhitespacesFromEachLine('   \n \n  ')).toEqual('\n\n');
      });
    });

    describe('default', () => {
      test('singleLine', () => {
        expect(removeLeadingWhitespacesFromEachLine('   string')).toEqual('string');
      });

      test('multiLine', () => {
        expect(removeLeadingWhitespacesFromEachLine('   one\n two\n  three')).toEqual('one\ntwo\nthree');
      });
    });

    test('mixed', () => {
      expect(removeLeadingWhitespacesFromEachLine('\none\n\n   two\n  \n three\n\n')).toEqual('\none\n\ntwo\n\nthree\n\n');
    });
  });

  describe('getLastLine', () => {
    test('empty', () => {
      expect(getLastLine('')).toEqual('');
    });

    test('singleLine', () => {
      expect(getLastLine('one')).toEqual('one');
    });

    test('multiLine', () => {
      expect(getLastLine('one\ntwo\nthree')).toEqual('three');
    });
  });
});
