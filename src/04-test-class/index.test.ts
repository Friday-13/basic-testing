import lodash from 'lodash';
import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

describe('BankAccount', () => {
  const getInitialAccount = (initialBalance = 100) => {
    const account = getBankAccount(initialBalance);
    return { initialBalance, account };
  };

  test('should create account with initial balance', () => {
    const initialBalance = 100;
    const account = getBankAccount(initialBalance);
    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const { initialBalance, account } = getInitialAccount();
    const wrongWithdraw = () => {
      account.withdraw(initialBalance + 100);
    };
    expect(wrongWithdraw).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const { initialBalance, account } = getInitialAccount();
    const { account: accountRecipient } = getInitialAccount();
    const wrongTransfer = () => {
      account.transfer(initialBalance + 100, accountRecipient);
    };
    expect(wrongTransfer).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const { initialBalance, account } = getInitialAccount();
    const wrongTransfer = () => {
      account.transfer(initialBalance + 100, account);
    };
    expect(wrongTransfer).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const { initialBalance, account } = getInitialAccount();
    const deposit = 100;
    account.deposit(deposit);
    expect(account.getBalance()).toBe(deposit + initialBalance);
  });

  test('should withdraw money', () => {
    const { initialBalance, account } = getInitialAccount();
    const withdraw = 50;
    account.withdraw(withdraw);
    expect(account.getBalance()).toBe(initialBalance - withdraw);
  });

  test('should transfer money', () => {
    const { initialBalance, account } = getInitialAccount();
    const { initialBalance: initialBalanceRec, account: accountRec } =
      getInitialAccount(200);
    const transfer = 50;
    account.transfer(transfer, accountRec);

    expect(account.getBalance()).toBe(initialBalance - transfer);
    expect(accountRec.getBalance()).toBe(initialBalanceRec + transfer);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const randomMock = jest.fn();
    lodash.random = randomMock;
    randomMock.mockReturnValueOnce(80).mockReturnValueOnce(1);
    const { account } = getInitialAccount();
    const balance = await account.fetchBalance();
    expect(typeof balance).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const { account } = getInitialAccount();
    account.fetchBalance = jest.fn().mockReturnValue(80);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(80);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const { account } = getInitialAccount();
    account.fetchBalance = jest.fn().mockReturnValue(null);
    const failedSyncronize = async () => {
      await account.synchronizeBalance();
    };
    expect(failedSyncronize).rejects.toThrow(SynchronizationFailedError);
  });
});
