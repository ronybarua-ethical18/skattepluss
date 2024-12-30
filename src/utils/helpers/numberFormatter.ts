export function numberFormatter(number: number) {
  return new Intl.NumberFormat('no-NO').format(number);
}
