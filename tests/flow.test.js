const request = require('supertest');
const { createApp } = require('../app');
const { appDataSource } = require('../src/utils/dataSource');
const supplies = require('./testSupplies.js');

describe('get ping', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
  });

  afterEach(async () => {});

  test('SUCCESS : get pong', async () => {
    const res = await request(app).get('/ping');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'pong',
    });
  });
});

describe('get MonthlyViewByFamily', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('SUCCESS :  get MonthlyViewByFamily', async () => {
    const res = await request(app)
      .get('/flow/view?rule=year&year=2023&unit=family')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send();

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'GET_SUCCESS',
      INCOME: {
        '1월': 3000000,
        '2월': 3500000,
        '3월': 3000000,
        '4월': 3000000,
        '5월': 4500000,
        '6월': 4500000,
        '7월': 4500000,
        '8월': 4500000,
        '9월': 4500000,
        '10월': 4500000,
        '11월': 5000000,
        '12월': 4500000,
      },
      SPENDING: {
        '1월': 1120500,
        '2월': 1120500,
        '3월': 1120500,
        '4월': 1120500,
        '5월': 1120500,
        '6월': 1120500,
        '7월': 1120500,
        '8월': 1120500,
        '9월': 1120500,
        '10월': 1120500,
        '11월': 864500,
        '12월': 618500,
      },
    });
  });
});

describe('get MonthlyViewByPrivate', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('SUCCESS :  get MonthlyViewByPrivate', async () => {
    const res = await request(app)
      .get('/flow/view?rule=year&year=2023&unit=private')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send();

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'GET_SUCCESS',
      INCOME: {
        '1월': 500000,
        '2월': 600000,
        '3월': 600000,
        '4월': 600000,
        '5월': 600000,
        '6월': 600000,
        '7월': 600000,
        '8월': 600000,
        '9월': 600000,
        '10월': 600000,
        '11월': 600000,
        '12월': 600000,
      },
      SPENDING: {
        '1월': 524500,
        '2월': 524500,
        '3월': 524500,
        '4월': 524500,
        '5월': 524500,
        '6월': 524500,
        '7월': 524500,
        '8월': 524500,
        '9월': 524500,
        '10월': 524500,
        '11월': 524500,
        '12월': 518500,
      },
    });
  });
});

describe('get CategoryViewByFamily', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('SUCCESS :  CategoryViewByFamily', async () => {
    const res = await request(app)
      .get('/flow/view?rule=category&year=2023&month=11&unit=family')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send();

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: 1,
        category: '생활비',
        spending: '99%',
      },
      {
        id: 2,
        category: '공과금',
        spending: '0%',
      },
      {
        id: 3,
        category: '기타',
        spending: '1%',
      },
      {
        id: 4,
        category: '기타사항',
        spending: '0%',
      },
    ]);
  });
});

describe('get CategoryViewByPrivate', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('SUCCESS :  CategoryViewByPrivate', async () => {
    const res = await request(app)
      .get('/flow/view?rule=category&year=2023&month=11&unit=private')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send();

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: 1,
        category: '생활비',
        spending: '99%',
      },
      {
        id: 2,
        category: '공과금',
        spending: '0%',
      },
      {
        id: 3,
        category: '기타',
        spending: '1%',
      },
      {
        id: 4,
        category: '기타사항',
        spending: '0%',
      },
    ]);
  });
});

describe('get Search', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('SUCCESS :  Search', async () => {
    const res = await request(app)
      .get('/flow/search?year=2023&month=10&date_order=ASC&choice_user_id=1&flow_type_id=2')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send();

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        user_id: 1,
        name: '김지훈',
        status: '지출',
        date: 3,
        category: '생활비',
        memo: '인터넷 이용료',
        amount: 89000,
        fixed_status: 1,
      },
      {
        user_id: 1,
        name: '김지훈',
        status: '지출',
        date: 4,
        category: '생활비',
        memo: '담배',
        amount: 4500,
        fixed_status: 0,
      },
      {
        user_id: 1,
        name: '김지훈',
        status: '지출',
        date: 5,
        category: '생활비',
        memo: '담배',
        amount: 4500,
        fixed_status: 0,
      },
      {
        user_id: 1,
        name: '김지훈',
        status: '지출',
        date: 9,
        category: '기타',
        memo: '실내낚시',
        amount: 6000,
        fixed_status: 0,
      },
      {
        user_id: 1,
        name: '김지훈',
        status: '지출',
        date: 10,
        category: '생활비',
        memo: '담배',
        amount: 4500,
        fixed_status: 0,
      },
      {
        user_id: 1,
        name: '김지훈',
        status: '지출',
        date: 11,
        category: '생활비',
        memo: '보험료',
        amount: 398000,
        fixed_status: 1,
      },
      {
        user_id: 1,
        name: '김지훈',
        status: '지출',
        date: 20,
        category: '생활비',
        memo: '담배',
        amount: 4500,
        fixed_status: 0,
      },
      {
        user_id: 1,
        name: '김지훈',
        status: '지출',
        date: 20,
        category: '생활비',
        memo: '담배',
        amount: 4500,
        fixed_status: 0,
      },
      {
        user_id: 1,
        name: '김지훈',
        status: '지출',
        date: 22,
        category: '생활비',
        memo: '담배',
        amount: 4500,
        fixed_status: 0,
      },
      {
        user_id: 1,
        name: '김지훈',
        status: '지출',
        date: 25,
        category: '생활비',
        memo: '담배',
        amount: 4500,
        fixed_status: 0,
      },
    ]);
  });
});

//*******************************************************
//*******************************************************
//*******************************************************
//*******************************************************

// 개인 수입/지출 등록 성공
describe('post MoneyFlow', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('SUCCESS: post MoneyFlow', async () => {
    const requestBody = {
      type: '지출',
      category: '생활비',
      memo: '환불해서 싼 걸로 바꿨어용. 게이밍 의자!',
      amount: 100000,
      year: 2023,
      month: 11,
      date: 14,
    };
    const res = await request(app)
      .post('/flow')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'POST_SUCCESS',
    });
  });
});

// 개인 수입/지출 등록 실패 req.body key/value 부족으로 인한 key error
describe('post MoneyFlow', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('FAILED: post MoneyFlow', async () => {
    const requestBody = {
      type: '지출',
      category: '생활비',
      memo: '환불해서 싼 걸로 바꿨어용. 게이밍 의자!',
      amount: 100000,
      year: 2023,
      date: 14,
    };
    const res = await request(app)
      .post('/flow')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: 'KEY_ERROR',
    });
  });
});

// 개인 수입/지출 조회 => 이아영 님의 2023년 2월 8일 수입/지출 내역
describe('get MoneyFlow', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('SUCCESS: get MoneyFlow', async () => {
    const requestQuery = {
      userName: '이아영',
      year: 2023,
      month: 2,
      date: 8,
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
          userName: '이아영',
          flowType: '지출',
          category: '생활비',
          memo: '식재료',
          amount: 120000,
          year: 2023,
          month: 2,
          date: 8,
        },
      ],
    });
  });
});

// 개인 수입/지출 수정 성공
describe('put MoneyFlow', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('SUCCESS: PUT MoneyFlow', async () => {
    const requestBody = {
      id: 5,
      type: '지출',
      category: '생활비',
      memo: '소고기 반품하고 더 싼 걸로 바꿨어용',
      amount: 1000000,
      year: 2023,
      month: 2,
      date: 9,
    };

    const res = await request(app)
      .put('/flow')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody); // Use .query() to send parameters in the query string

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'PUT_SUCCESS',
    });
  });
});

// 개인 수입/지출 수정 실패 => req.body key/value 부족으로 인한 key error
describe('put MoneyFlow', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('FAILED: PUT MoneyFlow', async () => {
    const requestBody = {
      id: 5,
      type: '지출',
      memo: '소고기 반품하고 더 싼 걸로 바꿨어용',
      amount: 1000000,
      year: 2023,
      month: 2,
      date: 9,
    };

    const res = await request(app)
      .put('/flow')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody); // Use .query() to send parameters in the query string

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: 'KEY_ERROR',
    });
  });
});

describe('delete MoneyFlow', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('SUCCESS: DELETE MoneyFlow', async () => {
    const requestQuery = {
      id: 43,
    };

    const res = await request(app)
      .delete('/flow')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery); // Use .query() to send parameters in the query string

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'DELETE_SUCCESS',
    });
  });
});

// 개인 수입/지출 삭제 실패 => 본인의 수입/지출 내역이 아님으로 인해 삭제 실패
describe('delete MoneyFlow', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('FAILED: DELETE MoneyFlow', async () => {
    const requestQuery = {
      id: 5,
    };

    const res = await request(app)
      .delete('/flow')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery); // Use .query() to send parameters in the query string

    expect(res.status).toBe(409);
    expect(res.body).toEqual({
      message: 'NOT_AUTHORIZED_TO_DELETE_OR_ALREADY_DELETED',
    });
  });
});

//*******************************************************
//*******************************************************
//*******************************************************
//*******************************************************

// 예산 등록 성공
describe('post Budget', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('SUCCESS: post Budget', async () => {
    const requestBody = {
      budget: 5000000,
      year: 2028,
      month: 1,
    };
    const res = await request(app)
      .post('/budget')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'POST_SUCCESS',
    });
  });
});

// 예산 등록 실패 (중복된 예산으로 인한 에러)
describe('post Budget', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('FAILED: post Budget', async () => {
    const requestBody = {
      budget: 5000000,
      year: 2023,
      month: 1,
    };
    const res = await request(app)
      .post('/budget')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(409);
    expect(res.body).toEqual({
      message: 'ALREADY_EXISTS',
    });
  });
});

// 예산 조회 성공
describe('get Budget', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('SUCCESS: get Budget', async () => {
    const requestQuery = {
      year: 2023,
      month: 1,
    };
    const res = await request(app)
      .get('/budget')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'GET_SUCCESS',
      budget: [
        {
          id: 1,
          budget: 3000000,
          year: 2023,
          month: 1,
        },
      ],
    });
  });
});

// 예산 조회 실패(
describe('get Budget', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('FAILED: get Budget', async () => {
    const requestQuery = {
      month: 1,
    };
    const res = await request(app)
      .get('/budget')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: 'KEY_ERROR_CHOOSE_YEAR',
    });
  });
});

// 잔여 예산 조회 성공
describe('get RestBudget', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('SUCCESS: get RestBudget', async () => {
    const requestQuery = {
      year: 2023,
      month: 1,
    };
    const res = await request(app)
      .get('/budget/rest')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'GET_SUCCESS',
      restBudget: 1233000,
    });
  });
});

// 잔여 예산 조회 실패
describe('get RestBudget', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('FAILED: get RestBudget', async () => {
    const requestQuery = {
      year: 2023,
    };
    const res = await request(app)
      .get('/budget/rest')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: 'KEY_ERROR',
    });
  });
});

// 예산 수정 성공
describe('put Budget', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('SUCCESS: put RestBudget', async () => {
    const requestBody = {
      budget: 5000000,
      year: 2023,
      month: 1,
    };
    const res = await request(app)
      .put('/budget')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'PUT_SUCCESS',
    });
  });
});

// 예산 수정 실패 (req.body key/value 부족으로 인한 key error)
describe('put Budget', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('FAILED: put RestBudget', async () => {
    const requestBody = {
      budget: 5000000,
      year: 2023,
    };
    const res = await request(app)
      .put('/budget')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: 'KEY_ERROR',
    });
  });
});

//*******************************************************
//*******************************************************
//*******************************************************
//*******************************************************

// 용돈 등록 성공 (관리자만)
describe('post Allowance', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('SUCCESS: post Allowance', async () => {
    const requestBody = {
      userName: '김지훈',
      allowance: 3000000,
      year: 2030,
      month: 1,
    };
    const res = await request(app)
      .post('/allowance')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'POST_SUCCESS',
    });
  });
});

// 용돈 등록 실패 (중복 등록으로 인한 실패)
describe('post Allowance', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('FAILED: post Allowance', async () => {
    const requestBody = {
      userName: '이아영',
      allowance: 3000000,
      year: 2023,
      month: 1,
    };
    const res = await request(app)
      .post('/allowance')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(409);
    expect(res.body).toEqual({
      message: 'ALREADY_EXISTS',
    });
  });
});

// 용돈 조회 성공 (특정 가족 유저의 특정 연, 월)
describe('get Allowance', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('SUCCESS: get Allowance', async () => {
    const requestQuery = {
      userName: '김지훈',
      year: 2023,
      month: 1,
    };
    const res = await request(app)
      .get('/allowance')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'GET_SUCCESS',
      allowances: [
        {
          id: 1,
          userName: '김지훈',
          allowance: 500000,
          year: 2023,
          month: 1,
        },
      ],
    });
  });
});

// 용돈 조회 실패 (특정 가족 유저의 특정 연, 월)
describe('get Allowance', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('FAILED: get Allowance', async () => {
    const requestQuery = {
      userName: '김지훈',
      month: 1,
    };
    const res = await request(app)
      .get('/allowance')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: 'KEY_ERROR_CHOOSE_YEAR',
    });
  });
});

// 잔여 용돈 조회 성공 (특정 가족 유저의 특정 연, 월의 잔여 용돈)
describe('get RestAllowance', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('SUCCESS: get RestAllowance', async () => {
    const requestQuery = {
      userName: '김지훈',
      year: 2023,
      month: 1,
    };
    const res = await request(app)
      .get('/allowance/rest')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'GET_SUCCESS',
      restAllowance: 462500,
    });
  });
});

// 잔여 용돈 조회 실패 (query 부족으로 인한 key error)
describe('get RestAllowance', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('FAILED: get RestAllowance', async () => {
    const requestQuery = {
      userName: '김지훈',
      month: 1,
    };
    const res = await request(app)
      .get('/allowance/rest')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: 'KEY_ERROR',
    });
  });
});

// 용돈 수정 성공 (관리자만)
describe('put Allowance', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('SUCCESS: put Allowance', async () => {
    const requestBody = {
      userName: '김지훈',
      allowance: 700000,
      year: 2023,
      month: 1,
    };
    const res = await request(app)
      .put('/allowance')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'PUT_SUCCESS',
    });
  });
});

// 용돈 수정 실패 (req.query 의 key/value 부족으로 인한 key error)
describe('put Allowance', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('FAILED: put Allowance', async () => {
    const requestBody = {
      userName: '김지훈',
      allowance: 700000,
      month: 1,
    };
    const res = await request(app)
      .put('/allowance')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: 'KEY_ERROR',
    });
  });
});

// 용돈 삭제 성공 (관리자만)
describe('delete Allowance', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('SUCCESS: delete Allowance', async () => {
    const requestQuery = {
      userName: '김지훈',
      year: 2023,
      month: 1,
    };
    const res = await request(app)
      .delete('/allowance')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'DELETE_SUCCESS',
    });
  });
});

// 용돈 삭제 실패 (존재하지 않거나 삭제된 용돈을 삭제하려 하는 경우 404 error)
describe('delete Allowance', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('FAILED: delete Allowance', async () => {
    const requestQuery = {
      userName: '김지훈',
      year: 1200,
      month: 1,
    };
    const res = await request(app)
      .delete('/allowance')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: 'NOT_EXISTING_OR_DELETED_ALLOWANCE',
    });
  });
});

//*******************************************************
//*******************************************************
//*******************************************************
//*******************************************************

// 고정 수입/지출 등록 성공 (관리자만)
describe('post FixedMoneyFlows', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('SUCCESS: post FixedMoneyFlows', async () => {
    const requestBody = {
      type: '지출',
      category: '기타',
      memo: '넷플릭스 구독료',
      amount: 1799,
      startYear: 2024,
      startMonth: 1,
      startDate: 12,
      endYear: 2025,
      endMonth: 12,
    };
    const res = await request(app)
      .post('/flow/fixed')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'POST_SUCCESS',
    });
  });
});

// 고정 수입/지출 등록 실패 (req.body 의 key 부족으로 인한 key error)
describe('post FixedMoneyFlows', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('FAILED: post FixedMoneyFlows', async () => {
    const requestBody = {
      type: '지출',
      category: '기타',
      memo: '넷플릭스 구독료',
      amount: 1799,
      startYear: 2024,
      startMonth: 1,
      endYear: 2025,
      endMonth: 12,
    };
    const res = await request(app)
      .post('/flow/fixed')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: 'KEY_ERROR',
    });
  });
});

// 고정 수입/지출 조회 성공 (관리자만)
describe('get FixedMoneyFlows', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('SUCCESS: get FixedMoneyFlows', async () => {
    const requestQuery = {
      year: 2023,
      month: 1,
      date: 11,
    };
    const res = await request(app)
      .get('/flow/fixed')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'GET_SUCCESS',
      flows: [
        {
          id: 1,
          userName: '김지훈',
          flowType: '지출',
          category: '생활비',
          memo: '보험료',
          amount: 398000,
          year: 2023,
          month: 1,
          date: 11,
        },
      ],
    });
  });
});

// 고정 수입/지출 조회 실패 (관리자만)
describe('get FixedMoneyFlows', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('FAILED: get FixedMoneyFlows', async () => {
    const requestQuery = {
      month: 1,
      date: 11,
    };
    const res = await request(app)
      .get('/flow/fixed')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: 'KEY_ERROR_SELECT_A_YEAR',
    });
  });
});

// 고정 수입/지출 수정 성공 (관리자만)
describe('put FixedMoneyFlows', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('SUCCESS: put FixedMoneyFlows', async () => {
    const requestBody = {
      id: 1,
      type: '지출',
      category: '생활비',
      memo: '보험료 인상',
      amount: 500000,
    };
    const res = await request(app)
      .put('/flow/fixed')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'PUT_SUCCESS',
    });
  });
});

// 고정 수입/지출 수정 실패 (req.body 의 key/value 부족으로 인한 400 key error)
describe('put FixedMoneyFlows', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('FAILED: put FixedMoneyFlows', async () => {
    const requestBody = {
      type: '지출',
      memo: '보험료 인상',
      amount: 500000,
    };
    const res = await request(app)
      .put('/flow/fixed')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send(requestBody);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: 'KEY_ERROR',
    });
  });
});

// 고정 수입/지출 삭제 성공 (관리자만, req.query 의 year, month, date 는 요청 시각과 일치해야 합니다. 브라우저에서 요청한 실시간입니다.)
describe('delete FixedMoneyFlows', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('SUCCESS: delete FixedMoneyFlows', async () => {
    const requestQuery = {
      id: 1,
      year: 2023,
      month: 5,
      date: 11,
    };
    const res = await request(app)
      .delete('/flow/fixed')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'DELETE_SUCCESS',
    });
  });
});

// 고정 수입/지출 삭제 실패 (관리자만, req.query key/value 부족으로 인한 400 key error)
describe('delete FixedMoneyFlows', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('FAILED: delete FixedMoneyFlows', async () => {
    const requestQuery = {
      year: 2023,
      month: 5,
    };
    const res = await request(app)
      .delete('/flow/fixed')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: 'KEY_ERROR',
    });
  });
});

// 관리자가 아닌 일반 유저의 권한 에러를 테스트합니다.
const generalUserToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRocmVlc2xAZ21haWwuY29tIiwiaWF0IjoxNzAwNTg2MzU3LCJleHAiOjg2NDAwMTcwMDU4NjM1N30.O614uELKf5xguT7qbGS7bkJmdOyW37MHIQFp92BUuKE';

// 고정 수입/지출 삭제 실패 (관리자 권한 없음 에러)
describe('delete FixedMoneyFlows', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('FAILED: delete FixedMoneyFlows', async () => {
    const requestQuery = {
      id: 1,
      year: 2023,
      month: 5,
      date: 11,
    };
    const res = await request(app)
      .delete('/flow/fixed')
      .set('Authorization', `Bearer ${generalUserToken}`)
      .query(requestQuery);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: 'NOT_AN_ADMIN',
    });
  });
});

//*******************************************************
//*******************************************************
//*******************************************************
//*******************************************************

// 가족이름목록조회 성공
describe('get UsersFamilyByUserId', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('SUCCESS: get UsersFamilyByUserId', async () => {
    const res = await request(app)
      .get('/family/user')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'GET_SUCCESS',
      familyUsers: [
        {
          id: 1,
          option: '김지훈',
        },
        {
          id: 2,
          option: '이아영',
        },
        {
          id: 3,
          option: '김지영',
        },
        {
          id: 4,
          option: '김민기',
        },
      ],
    });
  });
});

// 가족이름목록조회 실패 (가족에 가입되지 않은 유저가 요청 시 error)
describe('get UsersFamilyByUserId', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
    await appDataSource.query(`
      INSERT INTO users(email) VALUES ('openaifuture@gmail.com')
    `);
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('FAILED: get UsersFamilyByUserId', async () => {
    const testUserToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im9wZW5haWZ1dHVyZUBnbWFpbC5jb20iLCJpYXQiOjE3MDA1ODk2NzMsImV4cCI6ODY0MDAxNzAwNTg5NjczfQ.TzOthAaT8HuiXIVdsxvvEwL1c80Ra_5mSPzwkWwBgmE';
    const res = await request(app)
      .get('/family/user')
      .set('Authorization', `Bearer ${testUserToken}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: 'NOT_INCLUDED_IN_FAMILY',
    });
  });
});

//*******************************************************
//*******************************************************
//*******************************************************
//*******************************************************

// 수입지출여부목록 조회 성공
describe('get FlowTypes', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('SUCCESS: get FlowTypes', async () => {
    const res = await request(app)
      .get('/flow-type')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send();

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'GET_SUCCESS',
      types: [
        {
          id: 1,
          option: '수입',
        },
        {
          id: 2,
          option: '지출',
        },
      ],
    });
  });
});

//*******************************************************
//*******************************************************
//*******************************************************
//*******************************************************

// 카테고리 목록 조회 성공 (수입)
describe('get Category', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('SUCCESS: get Category', async () => {
    const requestQuery = {
      type: '수입',
    };
    const res = await request(app)
      .get('/category')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'GET_SUCCESS',
      category: [
        {
          id: 4,
          option: '기타사항',
          type: '수입',
        },
      ],
    });
  });
});

// 카테고리 목록 조회 성공 (지출)
describe('get Category', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('SUCCESS: get Category', async () => {
    const requestQuery = {
      type: '지출',
    };
    const res = await request(app)
      .get('/category')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'GET_SUCCESS',
      category: [
        {
          id: 1,
          option: '생활비',
          type: '지출',
        },
        {
          id: 2,
          option: '공과금',
          type: '지출',
        },
        {
          id: 3,
          option: '기타',
          type: '지출',
        },
      ],
    });
  });
});

// 카테고리 목록 조회 실패 (req.query key/value 부족으로 인한 key error)
describe('get Category', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    for (const query of supplies.startQuery) {
      await appDataSource.query(query);
    }
  });
  afterEach(async () => {
    for (const truncateQuery of supplies.truncate) {
      await appDataSource.query(truncateQuery);
    }

    await appDataSource.destroy();
  });

  test('FAILED: get Category', async () => {
    const requestQuery = {};
    const res = await request(app)
      .get('/category')
      .set('Authorization', `Bearer ${supplies.token}`)
      .query(requestQuery);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: 'KEY_ERROR',
    });
  });
});
