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

// 가족이름목록조회 성공
describe('get UsersFamilyByUserId', () => {
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

  test('SUCCESS: get UsersFamilyByUserId', async() => {
    const res = await request(app)
      .get('/family/user')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send({});

    expect(res.status).toBe(200)
    expect(res.body)
      .toEqual({
        message: "GET_SUCCESS",
        familyUsers: [
          {
            id: 1,
            option: "김지훈"
          },
          {
            id: 2,
            option: "이아영"
          },
          {
            id: 3,
            option: "김지영"
          },
          {
            id: 4,
            option: "김민기"
          }
        ]
      });
  });
});

// 가족이름목록조회 실패 (가족에 가입되지 않은 유저가 요청 시 error)
describe('get UsersFamilyByUserId', () => {
  let app;

  beforeAll(async() => {
    app = createApp()
    await appDataSource.initialize();
    for (let i=0; i<supplies.startQuery.length; i++){
      await appDataSource.query(supplies.startQuery[i])
    }
    await appDataSource.query(`
      INSERT INTO users(email) VALUES ('openaifuture@gmail.com')
    `)
  });
  afterEach(async() => {
    for (let i=0; i<supplies.truncate.length; i++){
      await appDataSource.query(supplies.truncate[i])
    }

    await appDataSource.destroy();
  });

  test('FAILED: get UsersFamilyByUserId', async() => {
    const testUserToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im9wZW5haWZ1dHVyZUBnbWFpbC5jb20iLCJpYXQiOjE3MDA1ODk2NzMsImV4cCI6ODY0MDAxNzAwNTg5NjczfQ.TzOthAaT8HuiXIVdsxvvEwL1c80Ra_5mSPzwkWwBgmE';
    const res = await request(app)
      .get('/family/user')
      .set('Authorization', `Bearer ${testUserToken}`)
      .send({});

    expect(res.status).toBe(400)
    expect(res.body)
      .toEqual({
        message: "NOT_INCLUDED_IN_FAMILY"
      });
  });
});