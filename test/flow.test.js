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

// 개인 수입/지출 등록 성공
describe('post MoneyFlow', () => {
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

  test('SUCCESS: post MoneyFlow', async() => {
    const requestBody = {
      type: "지출",
      category: "생활비",
      memo: "환불해서 싼 걸로 바꿨어용. 게이밍 의자!",
      amount: 100000,
      year: 2023,
      month: 11,
      date: 14
    }
    const res = await request(app)
      .post('/flow')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(200)
    expect(res.body)
      .toEqual({
        message: 'POST_SUCCESS',
      });
  });
});

// 개인 수입/지출 등록 실패 req.body key/value 부족으로 인한 key error
describe('post MoneyFlow', () => {
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

  test('FAILED: post MoneyFlow', async() => {
    const requestBody = {
      type: "지출",
      category: "생활비",
      memo: "환불해서 싼 걸로 바꿨어용. 게이밍 의자!",
      amount: 100000,
      year: 2023,
      date: 14
    }
    const res = await request(app)
      .post('/flow')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(400)
    expect(res.body)
      .toEqual({
        message: 'KEY_ERROR',
      });
  });
});

// 개인 수입/지출 조회 => 이아영 님의 2023년 2월 8일 수입/지출 내역
describe('get MoneyFlow', () => {
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

  test('SUCCESS: get MoneyFlow', async () => {
    const requestQuery = {
      userName: '이아영',
      year: 2023,
      month: 2,
      date: 8
    };

    const res = await request(app)
      .get('/flow')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'GET_SUCCESS',
      flows: [
        {
          id: 5,
          userName: "이아영",
          flowType: "지출",
          category: "생활비",
          memo: "식재료",
          amount: 120000,
          year: 2023,
          month: 2,
          date: 8
        }
      ]
    });
  });
});

// 개인 수입/지출 수정 성공
describe('put MoneyFlow', () => {
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

  test('SUCCESS: PUT MoneyFlow', async () => {
    const requestBody = {
      id: 5,
      type: "지출",
      category: "생활비",
      memo: "소고기 반품하고 더 싼 걸로 바꿨어용",
      amount: 1000000,
      year: 2023,
      month: 2,
      date: 9
    };

    const res = await request(app)
      .put('/flow')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody); // Use .query() to send parameters in the query string

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "PUT_SUCCESS"
    });
  });
});

// 개인 수입/지출 수정 실패 => req.body key/value 부족으로 인한 key error
describe('put MoneyFlow', () => {
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

  test('FAILED: PUT MoneyFlow', async () => {
    const requestBody = {
      id: 5,
      type: "지출",
      memo: "소고기 반품하고 더 싼 걸로 바꿨어용",
      amount: 1000000,
      year: 2023,
      month: 2,
      date: 9
    };

    const res = await request(app)
      .put('/flow')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody); // Use .query() to send parameters in the query string

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: "KEY_ERROR"
    });
  });
});

describe('delete MoneyFlow', () => {
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

  test('SUCCESS: DELETE MoneyFlow', async () => {
    const requestQuery = {
      id: 43
    };

    const res = await request(app)
      .delete('/flow')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery); // Use .query() to send parameters in the query string

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "DELETE_SUCCESS"
    });
  });
});

// 개인 수입/지출 삭제 실패 => 본인의 수입/지출 내역이 아님으로 인해 삭제 실패
describe('delete MoneyFlow', () => {
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

  test('FAILED: DELETE MoneyFlow', async () => {
    const requestQuery = {
      id: 5
    };

    const res = await request(app)
      .delete('/flow')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery); // Use .query() to send parameters in the query string

    expect(res.status).toBe(409);
    expect(res.body).toEqual({
      message: "NOT_AUTHORIZED_TO_DELETE_OR_ALREADY_DELETED"
    });
  });
});