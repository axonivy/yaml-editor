export const removeSingleLeadingWhitespaceFromEachLine = (string: string) => {
  return string.replace(/^[^\S\n]/gm, '');
};

export const addSingleLeadingWhitespaceToEachLine = (string: string) => {
  return string.replace(/^/gm, ' ');
};

export const getLastLine = (string: string) => {
  return string.split('\n').at(-1);
};
