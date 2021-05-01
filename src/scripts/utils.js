/*
  Formats data number to comma (,) seperated thousand readable
*/
export function makeHumanReadable(amount) {
    return parseFloat(amount).toLocaleString("en-NZ", {
      maximumFractionDigits: 0,
    });
}
