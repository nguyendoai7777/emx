import { removeEmptyFields } from './ext.util';
describe('Remove falsy key in object', () => {
  const expected = {
    lastname: 'Shark',
    firstname: 'Binh',
  };
  it('remove with empty string', () => {
    const data = {
      lastname: 'Shark',
      firstname: 'Binh',
      password: '',
      verifiedPassword: '',
    };
    const result = removeEmptyFields(data);
    expect(result).toEqual(expected);
  });
  it('remove with null', () => {
    const data = {
      lastname: 'Shark',
      firstname: 'Binh',
      password: null,
      verifiedPassword: null,
    };
    const result = removeEmptyFields(data);
    expect(result).toEqual(expected);
  });
  it('remove with undefined', () => {
    const data = {
      lastname: 'Shark',
      firstname: 'Binh',
      password: undefined,
      verifiedPassword: undefined,
    };
    const result = removeEmptyFields(data);
    expect(result).toEqual(expected);
  });
});
