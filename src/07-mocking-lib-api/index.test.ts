import axios from 'axios';
import { THROTTLE_TIME, throttledGetDataFromApi } from './index';

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  const path = 'test/path';
  const response = {
    data: 'response data',
  };

  const mockClient = () => {
    const mockedGet = jest.fn(() => response);
    const mockedClient = {
      get: mockedGet,
    };
    (axios.create as jest.Mock) = jest.fn(() => mockedClient);
    return { mockedGet, mockedClient };
  };

  test('should create instance with provided base url', async () => {
    mockClient();
    await throttledGetDataFromApi(path);
    jest.advanceTimersByTime(THROTTLE_TIME);
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const { mockedGet } = mockClient();
    await throttledGetDataFromApi(path);
    jest.advanceTimersByTime(THROTTLE_TIME);
    expect(mockedGet).toHaveBeenCalledWith(path);
  });

  test('should return response data', async () => {
    mockClient();
    const result = await throttledGetDataFromApi(path);
    jest.advanceTimersByTime(THROTTLE_TIME);
    expect(result).toBe(response.data);
  });
});
