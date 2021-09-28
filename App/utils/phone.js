export const censoredPhone = (val) => {
  if (val) {
    return '(' + val.substring(2, 5) + ')' + ' ***-*' + val.substring(9, 12);
  }

  return 'Anonymous';
};
