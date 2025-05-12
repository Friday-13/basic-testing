import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 1, b: 2, action: Action.Subtract, expected: -1 },
  { a: 169, b: 13, action: Action.Divide, expected: 13 },
  { a: 2, b: 5, action: Action.Exponentiate, expected: 32 },
  { a: 4, b: 7, action: 'invalid', expected: null },
  { a: 'invalid', b: 7, action: Action.Divide, expected: null },
  { a: 4, b: 'invalid', action: Action.Divide, expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)('calculate correct', ({ a, b, action, expected }) => {
    expect(simpleCalculator({ a, b, action })).toBe(expected);
  });
});
