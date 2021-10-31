import { expect } from 'chai';
import { isValidStyleObject } from '../generator/utils';

describe('generator / utils/ isValidStyleObject', () => {
  it('Return true for valid css-object', () => {
    expect(
      isValidStyleObject({
        hash: {
          color: 'red',
        },
      }),
    ).be.eq(true);
  });

  it('Return false for not valid css-object: empty object', () => {
    expect(isValidStyleObject({})).be.eq(false);
  });

  it('Return false for not valid css-object: object without inner properities with objects', () => {
    expect(
      isValidStyleObject({
        name: 'Name',
      }),
    ).be.eq(false);
  });

  it('Return false for not valid css-object: object is not passed or passed undefined', () => {
    expect(isValidStyleObject(undefined)).be.eq(false);
  });
});
