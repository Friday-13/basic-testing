import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const action = Action['Add'];
    expect(simpleCalculator({ a: 1, b: 2, action: action })).toBe(3);
  });

  test('should subtract two numbers', () => {
    const action = Action['Subtract'];
    expect(simpleCalculator({ a: 1, b: 2, action: action })).toBe(-1);
  });

  test('should multiply two numbers', () => {
    const action = Action['Multiply'];
    expect(simpleCalculator({ a: 4, b: 7, action: action })).toBe(28);
  });

  test('should divide two numbers', () => {
    const action = Action['Divide'];
    expect(simpleCalculator({ a: 169, b: 13, action: action })).toBe(13);
  });

  test('should exponentiate two numbers', () => {
    const action = Action['Exponentiate'];
    expect(simpleCalculator({ a: 2, b: 5, action: action })).toBe(32);
  });

  test('should return null for invalid action', () => {
    expect(simpleCalculator({ a: 4, b: 7, action: 'invalid' })).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    const action = Action['Divide'];
    expect(
      simpleCalculator({ a: 'invalid', b: 13, action: action }),
    ).toBeNull();
    expect(simpleCalculator({ a: 10, b: '13', action: action })).toBeNull();
  });
});
