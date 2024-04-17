export const removeLeadingWhitespacesFromEachLine = (string: string) => {
  return string.replace(/^[^\S\n]+/gm, '');
};

export const getLastLine = (string: string) => {
  return string.split('\n').at(-1);
};
