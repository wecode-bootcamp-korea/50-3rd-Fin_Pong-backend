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

// 카테고리 목록 조회 성공 (수입)
describe('get Category', () => {
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

  test('SUCCESS: get Category', async() => {
    const requestQuery = {
        type: "수입"
    }
    const res = await request(app)
      .get('/category')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(200)
    expect(res.body)
      .toEqual({
        message: "GET_SUCCESS",
        category: [
          {
            id: 4,
            option: "기타사항",
            type: "수입"
          }
        ]
      });
  });
});

// 카테고리 목록 조회 성공 (지출)
describe('get Category', () => {
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

  test('SUCCESS: get Category', async() => {
    const requestQuery = {
        type: "지출"
    }
    const res = await request(app)
      .get('/category')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(200)
    expect(res.body)
      .toEqual({
        message: "GET_SUCCESS",
        category: [
          {
            id: 1,
            option: "생활비",
            type: "지출"
          },
          {
            id: 2,
            option: "공과금",
            type: "지출"
          },
          {
            id: 3,
            option: "기타",
            type: "지출"
          }
        ]
      });
  });
});

// 카테고리 목록 조회 실패 (req.query key/value 부족으로 인한 key error)
describe('get Category', () => {
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

  test('FAILED: get Category', async() => {
    const requestQuery = {
    }
    const res = await request(app)
      .get('/category')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(400)
    expect(res.body)
      .toEqual({
        message: "KEY_ERROR"
      });
  });
});