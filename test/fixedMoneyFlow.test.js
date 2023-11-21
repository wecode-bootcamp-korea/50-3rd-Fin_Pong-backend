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

// 고정 수입/지출 등록 성공 (관리자만)
describe('post FixedMoneyFlows', () => {
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

  test('SUCCESS: post FixedMoneyFlows', async() => {
    const requestBody = {
      type : "지출",
      category : "기타",
      memo : "넷플릭스 구독료",
      amount : 1799,
      startYear: 2024,
      startMonth: 1,
      startDate: 12,
      endYear : 2025,
      endMonth: 12
    }
    const res = await request(app)
      .post('/flow/fixed')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(200)
    expect(res.body)
      .toEqual({
        message: 'POST_SUCCESS',
      });
  });
});

// 고정 수입/지출 등록 실패 (req.body 의 key 부족으로 인한 key error)
describe('post FixedMoneyFlows', () => {
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

  test('FAILED: post FixedMoneyFlows', async() => {
    const requestBody = {
      type : "지출",
      category : "기타",
      memo : "넷플릭스 구독료",
      amount : 1799,
      startYear: 2024,
      startMonth: 1,
      endYear : 2025,
      endMonth: 12
    }
    const res = await request(app)
      .post('/flow/fixed')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(400)
    expect(res.body)
      .toEqual({
        message: 'KEY_ERROR'
      });
  });
});

// 고정 수입/지출 조회 성공 (관리자만)
describe('get FixedMoneyFlows', () => {
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

  test('SUCCESS: get FixedMoneyFlows', async() => {
    const requestQuery = {
      year : 2023,
      month: 1,
      date: 11
    }
    const res = await request(app)
      .get('/flow/fixed')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(200)
    expect(res.body)
      .toEqual({
        message: 'GET_SUCCESS',
        flows: [
          {
            id: 1,
            userName: "김지훈",
            flowType: "지출",
            category: "생활비",
            memo: "보험료",
            amount: 398000,
            year: 2023,
            month: 1,
            date: 11
          }]
      });
  });
});

// 고정 수입/지출 조회 실패 (관리자만)
describe('get FixedMoneyFlows', () => {
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

  test('FAILED: get FixedMoneyFlows', async() => {
    const requestQuery = {
      month: 1,
      date: 11
    }
    const res = await request(app)
      .get('/flow/fixed')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(400)
    expect(res.body)
      .toEqual({
        message: 'KEY_ERROR_SELECT_A_YEAR'
      });
  });
});

// 고정 수입/지출 수정 성공 (관리자만)
describe('put FixedMoneyFlows', () => {
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

  test('SUCCESS: put FixedMoneyFlows', async() => {
    const requestBody = {
      id: 1,
      type: "지출",
      category: "생활비",
      memo: "보험료 인상",
      amount: 500000
    }
    const res = await request(app)
      .put('/flow/fixed')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(200)
    expect(res.body)
      .toEqual({
        message: 'PUT_SUCCESS'
      });
  });
});

// 고정 수입/지출 수정 실패 (req.body 의 key/value 부족으로 인한 400 key error)
describe('put FixedMoneyFlows', () => {
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

  test('FAILED: put FixedMoneyFlows', async() => {
    const requestBody = {
      type: "지출",
      memo: "보험료 인상",
      amount: 500000
    }
    const res = await request(app)
      .put('/flow/fixed')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(400)
    expect(res.body)
      .toEqual({
        message: 'KEY_ERROR'
      });
  });
});

// 고정 수입/지출 삭제 성공 (관리자만, req.query 의 year, month, date 는 요청 시각과 일치해야 합니다. 브라우저에서 요청한 실시간입니다.)
describe('delete FixedMoneyFlows', () => {
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

  test('SUCCESS: delete FixedMoneyFlows', async() => {
    const requestQuery = {
      id: 1,
      year: 2023,
      "month": 5,
      date: 11
    }
    const res = await request(app)
      .delete('/flow/fixed')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(200)
    expect(res.body)
      .toEqual({
        message: 'DELETE_SUCCESS'
      });
  });
});

// 고정 수입/지출 삭제 실패 (관리자만, req.query key/value 부족으로 인한 400 key error)
describe('delete FixedMoneyFlows', () => {
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

  test('FAILED: delete FixedMoneyFlows', async() => {
    const requestQuery = {
      year: 2023,
      month: 5
    }
    const res = await request(app)
      .delete('/flow/fixed')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(400)
    expect(res.body)
      .toEqual({
        message: 'KEY_ERROR'
      });
  });
});

// 관리자가 아닌 일반 유저의 권한 에러를 테스트합니다.
const generalUserToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRocmVlc2xAZ21haWwuY29tIiwiaWF0IjoxNzAwNTg2MzU3LCJleHAiOjg2NDAwMTcwMDU4NjM1N30.O614uELKf5xguT7qbGS7bkJmdOyW37MHIQFp92BUuKE';

// 고정 수입/지출 삭제 실패 (관리자 권한 없음 에러)
describe('delete FixedMoneyFlows', () => {
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

  test('FAILED: delete FixedMoneyFlows', async() => {
    const requestQuery = {
      id: 1,
      year: 2023,
      month: 5,
      date: 11
    }
    const res = await request(app)
      .delete('/flow/fixed')
      .set('Authorization', `Bearer ${generalUserToken}`)
      .query(requestQuery);

    expect(res.status).toBe(400)
    expect(res.body)
      .toEqual({
        message: 'NOT_AN_ADMIN'
      });
  });
});
