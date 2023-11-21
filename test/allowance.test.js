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

// 용돈 등록 성공 (관리자만)
describe('post Allowance', () => {
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

  test('SUCCESS: post Allowance', async() => {
    const requestBody = {
      userName: "김지훈",
      allowance : 3000000,
      year: 2030,
      month: 1
    }
    const res = await request(app)
      .post('/allowance')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(200)
    expect(res.body)
      .toEqual({
        message: 'POST_SUCCESS',
      });
  });
});

// 용돈 등록 실패 (중복 등록으로 인한 실패)
describe('post Allowance', () => {
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

  test('FAILED: post Allowance', async() => {
    const requestBody = {
      userName: "이아영",
      allowance : 3000000,
      year: 2023,
      month: 1
    }
    const res = await request(app)
      .post('/allowance')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(409)
    expect(res.body)
      .toEqual({
        message: 'ALREADY_EXISTS',
      });
  });
});

// 용돈 조회 성공 (특정 가족 유저의 특정 연, 월)
describe('get Allowance', () => {
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

  test('SUCCESS: get Allowance', async() => {
    const requestQuery = {
      userName: "김지훈",
      year: 2023,
      month: 1
    }
    const res = await request(app)
      .get('/allowance')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(200)
    expect(res.body)
      .toEqual({
        message: "GET_SUCCESS",
        allowances: [
          {
            id: 1,
            userName: "김지훈",
            allowance: 500000,
            year: 2023,
            month: 1
          }]
     });
  });
});

// 용돈 조회 실패 (특정 가족 유저의 특정 연, 월)
describe('get Allowance', () => {
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

  test('FAILED: get Allowance', async() => {
    const requestQuery = {
      userName: "김지훈",
      month: 1
    }
    const res = await request(app)
      .get('/allowance')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(400)
    expect(res.body)
      .toEqual({
        message: "KEY_ERROR_CHOOSE_YEAR"
     });
  });
});

// 잔여 용돈 조회 성공 (특정 가족 유저의 특정 연, 월의 잔여 용돈)
describe('get RestAllowance', () => {
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

  test('SUCCESS: get RestAllowance', async() => {
    const requestQuery = {
      userName: "김지훈",
      year: 2023,
      month: 1
    }
    const res = await request(app)
      .get('/allowance/rest')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(200)
    expect(res.body)
      .toEqual({
        message: "GET_SUCCESS",
        restAllowance: 462500
      });
  });
});

// 잔여 용돈 조회 실패 (query 부족으로 인한 key error)
describe('get RestAllowance', () => {
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

  test('FAILED: get RestAllowance', async() => {
    const requestQuery = {
      userName: "김지훈",
      month: 1
    }
    const res = await request(app)
      .get('/allowance/rest')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(400)
    expect(res.body)
      .toEqual({
        message: "KEY_ERROR"
      });
  });
});

// 용돈 수정 성공 (관리자만)
describe('put Allowance', () => {
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

  test('SUCCESS: put Allowance', async() => {
    const requestBody = {
      userName: "김지훈",
      allowance : 700000,
      year: 2023,
      month: 1
    }
    const res = await request(app)
      .put('/allowance')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(200)
    expect(res.body)
      .toEqual({
        message: "PUT_SUCCESS"
      });
  });
});

// 용돈 수정 실패 (req.query 의 key/value 부족으로 인한 key error)
describe('put Allowance', () => {
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

  test('FAILED: put Allowance', async() => {
    const requestBody = {
      userName: "김지훈",
      allowance : 700000,
      month: 1
    }
    const res = await request(app)
      .put('/allowance')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(400)
    expect(res.body)
      .toEqual({
        message: "KEY_ERROR"
      });
  });
});

// 용돈 삭제 성공 (관리자만)
describe('delete Allowance', () => {
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

  test('SUCCESS: delete Allowance', async() => {
  const requestQuery = {
      userName: "김지훈",
      year: 2023,
      month: 1
    }
    const res = await request(app)
      .delete('/allowance')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(200)
    expect(res.body)
      .toEqual({
        message: "DELETE_SUCCESS"
      });
  });
});

// 용돈 삭제 실패 (존재하지 않거나 삭제된 용돈을 삭제하려 하는 경우 404 error)
describe('delete Allowance', () => {
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

  test('FAILED: delete Allowance', async() => {
  const requestQuery = {
      userName: "김지훈",
      year: 1200,
      month: 1
    }
    const res = await request(app)
      .delete('/allowance')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(404)
    expect(res.body)
      .toEqual({
        message: "NOT_EXISTING_OR_DELETED_ALLOWANCE"
      });
  });
});