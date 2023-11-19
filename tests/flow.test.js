const request = require('supertest');
const { createApp } = require('../app');
const { AppDataSource } = require('../src/utils/dataSource');

describe('Ping API', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  afterAll(() => {

  });

  test('should respond with status 200 and message "pong"', async () => {
    const response = await request(app).get('/ping');

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      message: 'pong'
    });
  });
});
