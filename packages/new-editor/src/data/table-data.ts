export const updateRowData = <TData>(data: Array<TData>, index: number, newRowData: TData) => {
  const newData = structuredClone(data);
  if (index > data.length - 1) {
    return newData;
  }
  newData[index] = newRowData;
  return newData;
};
