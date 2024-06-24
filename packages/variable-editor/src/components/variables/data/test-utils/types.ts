import { type Cell, type FilterMeta, type Row, type RowPinningPosition } from '@tanstack/react-table';

export class MockRow<TData> implements Row<TData> {
  original;
  parentRows;

  constructor(original: TData, parentRows: Array<MockRow<TData>>) {
    this.original = original;
    this.parentRows = parentRows;
  }

  getParentRows = () => {
    return this.parentRows;
  };

  _getAllCellsByColumnId: () => Record<string, Cell<TData, unknown>>;
  _uniqueValuesCache: Record<string, unknown>;
  _valuesCache: Record<string, unknown>;
  depth: number;
  getAllCells: () => Cell<TData, unknown>[];
  getLeafRows: () => Row<TData>[];
  getParentRow: () => Row<TData> | undefined;
  getUniqueValues: <TValue>(columnId: string) => TValue[];
  getValue: <TValue>(columnId: string) => TValue;
  id: string;
  index: number;
  originalSubRows?: TData[] | undefined;
  parentId?: string | undefined;
  renderValue: <TValue>(columnId: string) => TValue;
  subRows: Row<TData>[];
  _getAllVisibleCells: () => Cell<TData, unknown>[];
  getVisibleCells: () => Cell<TData, unknown>[];
  getCenterVisibleCells: () => Cell<TData, unknown>[];
  getLeftVisibleCells: () => Cell<TData, unknown>[];
  getRightVisibleCells: () => Cell<TData, unknown>[];
  getCanPin: () => boolean;
  getIsPinned: () => RowPinningPosition;
  getPinnedIndex: () => number;
  pin: (position: RowPinningPosition, includeLeafRows?: boolean | undefined, includeParentRows?: boolean | undefined) => void;
  columnFilters: Record<string, boolean>;
  columnFiltersMeta: Record<string, FilterMeta>;
  _groupingValuesCache: Record<string, any>;
  getGroupingValue: (columnId: string) => unknown;
  getIsGrouped: () => boolean;
  groupingColumnId?: string | undefined;
  groupingValue?: unknown;
  getCanMultiSelect: () => boolean;
  getCanSelect: () => boolean;
  getCanSelectSubRows: () => boolean;
  getIsAllSubRowsSelected: () => boolean;
  getIsSelected: () => boolean;
  getIsSomeSelected: () => boolean;
  getToggleSelectedHandler: () => (event: unknown) => void;
  toggleSelected: (value?: boolean | undefined, opts?: { selectChildren?: boolean | undefined } | undefined) => void;
  getCanExpand: () => boolean;
  getIsAllParentsExpanded: () => boolean;
  getIsExpanded: () => boolean;
  getToggleExpandedHandler: () => () => void;
  toggleExpanded: (expanded?: boolean | undefined) => void;
}
