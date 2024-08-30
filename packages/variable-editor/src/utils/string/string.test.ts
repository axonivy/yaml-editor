import { addSingleLeadingWhitespaceToEachLine, getLastLine, removeSingleLeadingWhitespaceFromEachLine } from './string';

describe('removeSingleLeadingWhitespaceFromEachLine', () => {
  test('empty', () => {
    expect(removeSingleLeadingWhitespaceFromEachLine('')).toEqual('');
  });

  describe('whitespaceOnly', () => {
    test('singleLine', () => {
      expect(removeSingleLeadingWhitespaceFromEachLine('   ')).toEqual('  ');
    });

    test('multiLine', () => {
      expect(removeSingleLeadingWhitespaceFromEachLine('   \n \n  ')).toEqual('  \n\n ');
    });
  });

  describe('default', () => {
    test('singleLine', () => {
      expect(removeSingleLeadingWhitespaceFromEachLine('   string')).toEqual('  string');
    });

    test('multiLine', () => {
      expect(removeSingleLeadingWhitespaceFromEachLine('   one\n two\n  three')).toEqual('  one\ntwo\n three');
    });
  });

  test('mixed', () => {
    expect(removeSingleLeadingWhitespaceFromEachLine('\none\n\n   two\n  \n three\n\n')).toEqual('\none\n\n  two\n \nthree\n\n');
  });
});

describe('addSingleLeadingWhitespaceToEachLine', () => {
  test('empty', () => {
    expect(addSingleLeadingWhitespaceToEachLine('')).toEqual(' ');
  });

  test('singleLine', () => {
    expect(addSingleLeadingWhitespaceToEachLine('text')).toEqual(' text');
  });

  test('multiLine', () => {
    expect(addSingleLeadingWhitespaceToEachLine('lineOne\nlineTwo\nlineThree')).toEqual(' lineOne\n lineTwo\n lineThree');
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
