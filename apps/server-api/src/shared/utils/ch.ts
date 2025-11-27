export function calculateSquare(num: unknown) {
  if (typeof num !== 'number') {
    throw new Error('You must provide a number.');
  }
  return num * num;
}
