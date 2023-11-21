const request = require('supertest');
const { createApp } = require('../app');
const { appDataSource } = require('../src/utils/dataSource');
const supplies = require('./testSupplies.js');

describe('get ping', () => {
  let app;

  beforeAll(async() => {
    app = createApp();
    await appDataSource.initialize();
    for (let i=0; i<supplies.startQuery.length; i++){
      await appDataSource.query(supplies.startQuery[i])
    }
  });

  afterEach(async() => {
    for (let i=0; i<supplies.truncate.length; i++){
      await appDataSource.query(supplies.truncate[i])
    }
    await appDataSource.destroy();
  });

  test('SUCCESS : get pong', async () => {
    const res = await request(app)
      .get('/ping');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message : 'pong'
    });
  });
});

// 예산 등록 성공
describe('post Budget', () => {
  let app;

  beforeAll(async() => {
    app = createApp()
    await appDataSource.initialize();
    for (let i=0; i<supplies.startQuery.length; i++){
      await appDataSource.query(supplies.startQuery[i])
    }
  });
  afterEach(async() => {
    for (let i=0; i<supplies.truncate.length; i++){
      await appDataSource.query(supplies.truncate[i])
    }

    await appDataSource.destroy();
  });

  test('SUCCESS: post Budget', async() => {
    const requestBody = {
      "budget": 5000000,
      "year": 2028,
      "month": 1
    }
    const res = await request(app)
      .post('/budget')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(200)
    expect(res.body)
      .toEqual({
        message: 'POST_SUCCESS',
      });
  });
});

// 예산 등록 실패 (중복된 예산으로 인한 에러)
describe('post Budget', () => {
  let app;

  beforeAll(async() => {
    app = createApp()
    await appDataSource.initialize();
    for (let i=0; i<supplies.startQuery.length; i++){
      await appDataSource.query(supplies.startQuery[i])
    }
  });
  afterEach(async() => {
    for (let i=0; i<supplies.truncate.length; i++){
      await appDataSource.query(supplies.truncate[i])
    }

    await appDataSource.destroy();
  });

  test('FAILED: post Budget', async() => {
    const requestBody = {
      "budget": 5000000,
      "year": 2023,
      "month": 1
    }
    const res = await request(app)
      .post('/budget')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(409)
    expect(res.body)
      .toEqual({
        message: 'ALREADY_EXISTS',
      });
  });
});

// 예산 조회 성공
describe('get Budget', () => {
  let app;

  beforeAll(async() => {
    app = createApp()
    await appDataSource.initialize();
    for (let i=0; i<supplies.startQuery.length; i++){
      await appDataSource.query(supplies.startQuery[i])
    }
  });
  afterEach(async() => {
    for (let i=0; i<supplies.truncate.length; i++){
      await appDataSource.query(supplies.truncate[i])
    }

    await appDataSource.destroy();
  });

  test('SUCCESS: get Budget', async() => {
    const requestQuery = {
      year: 2023,
      month: 1
    }
    const res = await request(app)
      .get('/budget')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(200)
    expect(res.body)
      .toEqual(
        {
          message: "GET_SUCCESS",
          budget: [
            {
              id: 1,
              budget: 3000000,
              year: 2023,
              month: 1
            }
          ]
        }
      );
  });
});

// 예산 조회 실패(
describe('get Budget', () => {
  let app;

  beforeAll(async() => {
    app = createApp()
    await appDataSource.initialize();
    for (let i=0; i<supplies.startQuery.length; i++){
      await appDataSource.query(supplies.startQuery[i])
    }
  });
  afterEach(async() => {
    for (let i=0; i<supplies.truncate.length; i++){
      await appDataSource.query(supplies.truncate[i])
    }

    await appDataSource.destroy();
  });

  test('FAILED: get Budget', async() => {
    const requestQuery = {
      month: 1
    }
    const res = await request(app)
      .get('/budget')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(400)
    expect(res.body)
      .toEqual(
        {
          message: "KEY_ERROR_CHOOSE_YEAR"
        }
      );
  });
});

// 잔여 예산 조회 성공
describe('get RestBudget', () => {
  let app;

  beforeAll(async() => {
    app = createApp()
    await appDataSource.initialize();
    for (let i=0; i<supplies.startQuery.length; i++){
      await appDataSource.query(supplies.startQuery[i])
    }
  });
  afterEach(async() => {
    for (let i=0; i<supplies.truncate.length; i++){
      await appDataSource.query(supplies.truncate[i])
    }

    await appDataSource.destroy();
  });

  test('SUCCESS: get RestBudget', async() => {
    const requestQuery = {
      year: 2023,
      month: 1
    }
    const res = await request(app)
      .get('/budget/rest')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(200)
    expect(res.body)
      .toEqual(
        {
          message: "GET_SUCCESS",
          restBudget: 1233000
        }
      );
  });
});

// 잔여 예산 조회 실패
describe('get RestBudget', () => {
  let app;

  beforeAll(async() => {
    app = createApp()
    await appDataSource.initialize();
    for (let i=0; i<supplies.startQuery.length; i++){
      await appDataSource.query(supplies.startQuery[i])
    }
  });
  afterEach(async() => {
    for (let i=0; i<supplies.truncate.length; i++){
      await appDataSource.query(supplies.truncate[i])
    }

    await appDataSource.destroy();
  });

  test('FAILED: get RestBudget', async() => {
    const requestQuery = {
      year: 2023
    }
    const res = await request(app)
      .get('/budget/rest')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(400)
    expect(res.body)
      .toEqual(
        {
          message: "KEY_ERROR"
        }
      );
  });
});

// 예산 수정 성공
describe('put Budget', () => {
  let app;

  beforeAll(async() => {
    app = createApp()
    await appDataSource.initialize();
    for (let i=0; i<supplies.startQuery.length; i++){
      await appDataSource.query(supplies.startQuery[i])
    }
  });
  afterEach(async() => {
    for (let i=0; i<supplies.truncate.length; i++){
      await appDataSource.query(supplies.truncate[i])
    }

    await appDataSource.destroy();
  });

  test('SUCCESS: put RestBudget', async() => {
    const requestBody = {
      "budget": 5000000,
      "year": 2023,
      "month": 1
    }
    const res = await request(app)
      .put('/budget')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(200)
    expect(res.body)
      .toEqual(
        {
          message: "PUT_SUCCESS"
        }
      );
  });
});

// 예산 수정 성공
describe('put Budget', () => {
  let app;

  beforeAll(async() => {
    app = createApp()
    await appDataSource.initialize();
    for (let i=0; i<supplies.startQuery.length; i++){
      await appDataSource.query(supplies.startQuery[i])
    }
  });
  afterEach(async() => {
    for (let i=0; i<supplies.truncate.length; i++){
      await appDataSource.query(supplies.truncate[i])
    }

    await appDataSource.destroy();
  });

  test('FAILED: put RestBudget', async() => {
    const requestBody = {
      "budget": 5000000,
      "year": 2023
    }
    const res = await request(app)
      .put('/budget')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(400)
    expect(res.body)
      .toEqual(
        {
          message: "KEY_ERROR"
        }
      );
  });
});
