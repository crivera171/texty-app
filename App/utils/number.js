export const numberFilter = (num, places) => {
  places = places || 0;
  num = num.toString().replace(/[^0-9.]/g, '');
  num = num.toString().replace(',', '.');
  return parseFloat(num).toFixed(places);
};

export const formatPrice = (currentPrice = '') => {
  const adjustedPrice =
    currentPrice.length < 4 ? currentPrice.padStart(3, '0') : currentPrice;
  const decimals = adjustedPrice.slice(-2);
  const nonDecimals = adjustedPrice.slice(0, -2);

  return (
    '$ ' +
    nonDecimals
      .split('')
      .reverse()
      .reduce((a, e, i) => {
        if (i === nonDecimals.length - 1) {
          return a + e + '';
        }
        return a + e + (i % 3 === 2 ? ',' : '');
      }, '')
      .split('')
      .reverse()
      .join('') +
    '.' +
    decimals
  );
};

export const convertFromMicros = (p, places) => {
  return (p / 100).toFixed(places);
};
