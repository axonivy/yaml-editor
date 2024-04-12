import { updateRowData } from './table-data';
import type { TestData } from '../test-utils/types';

let data: Array<TestData>;
let newRowData: TestData;

beforeEach(() => {
  data = [
    { name: 'NameData0', value: 'ValueData0' },
    { name: 'NameData1', value: 'ValueData1' },
    { name: 'NameData2', value: 'ValueData2' }
  ];
  newRowData = { name: 'newDataName', value: 'newDataValue' };
});

describe('table-data', () => {
  describe('updateRowData', () => {
    test('default', () => {
      const originalData = structuredClone(data);
      const newData = updateRowData(data, 1, newRowData);
      expect(data).toEqual(originalData);
      expect(newData).not.toBe(data);
      expect(newData).toHaveLength(3);
      expect(newData[0]).toEqual(data[0]);
      expect(newData[1]).toEqual(newRowData);
      expect(newData[2]).toEqual(data[2]);
    });

    test('indexOutOfBounds', () => {
      const originalData = structuredClone(data);
      const newData = updateRowData(data, 3, newRowData);
      expect(data).toEqual(originalData);
      expect(newData).not.toBe(data);
      expect(newData).toEqual(data);
    });
  });
});
