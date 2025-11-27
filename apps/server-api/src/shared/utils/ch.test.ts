import { calculateSquare } from './ch';

describe('calculateSquare', () => {
  it('should throw an error if called without a number', () => {
    // Wrap the function call in an anonymous function
    expect(() => {
      calculateSquare('45'); // Calling with an invalid type
    }).toThrow('You must provide a number.'); // Asserting the error message
  });

  it('should throw a specific error type', () => {
    expect(() => {
      calculateSquare(null); // Calling with null, which is not a number
    }).toThrow(Error); // Asserting the error type
  });

  it('should throw an error matching a regex', () => {
    expect(() => {
      calculateSquare('abc');
    }).toThrow(/provide a number/); // Asserting with a regular expression
  });
});
