import type { Row } from '@tanstack/react-table';
import type { Variable } from '../variable';

type DeepPartial<T> = T extends Array<infer U> ? Array<DeepPartial<U>> : { [A in keyof T]?: DeepPartial<T[A]> };

export const mockRow = (name: string, parentName: string): DeepPartial<Row<Variable>> => {
  return {
    original: {
      name: name
    },
    getParentRows: () => [
      {
        original: {
          name: parentName
        }
      }
    ]
  };
};
