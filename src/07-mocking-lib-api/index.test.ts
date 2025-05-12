import axios from 'axios';
import { THROTTLE_TIME, throttledGetDataFromApi } from './index';

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
    jest.unmock('axios');
  });

  const path = 'test/path';
  const response = {
    data: 'response data',
  };

  test('should create instance with provided base url', async () => {
    const mockedAxiosClient = jest.spyOn(axios, 'create');
    await throttledGetDataFromApi('');
    jest.advanceTimersByTime(THROTTLE_TIME);
    expect(mockedAxiosClient).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const mockedGet = jest.fn(() => response);
    const mockedClient = {
      get: mockedGet,
    };
    (axios.create as jest.Mock) = jest.fn(() => mockedClient);
    await throttledGetDataFromApi(path);
    jest.advanceTimersByTime(THROTTLE_TIME);
    expect(mockedGet).toHaveBeenCalledWith(path);
  });

  test('should return response data', async () => {
    const mockedGet = jest.fn(() => response);
    const mockedClient = {
      get: mockedGet,
    };
    (axios.create as jest.Mock) = jest.fn(() => mockedClient);
    const result = await throttledGetDataFromApi(path);
    jest.advanceTimersByTime(THROTTLE_TIME);
    expect(result).toBe(response.data);
  });
});
