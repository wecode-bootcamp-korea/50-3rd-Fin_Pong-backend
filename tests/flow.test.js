const request = require('supertest');
const { createApp } = require('../app');
const { appDataSource } = require('../src/utils/dataSource');
const supplies = require('./testSupplies.js');

describe('get ping', () => {
  let app;

  beforeAll(async() => {
    app = createApp();

  });

  afterEach(async() => {

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

describe('get MonthlyViewByFamily', () => {
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

  test('SUCCESS :  get MonthlyViewByFamily', async() => {
    const res = await request(app)
      .get('/flow/view?rule=year&year=2023&unit=family')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send()

      expect(res.status).toBe(200)
      expect(res.body)
        .toEqual({
          "INCOME": {
              "1월": 3000000,
              "2월": 3500000,
              "3월": 3000000,
              "4월": 3000000,
              "5월": 4500000,
              "6월": 4500000,
              "7월": 4500000,
              "8월": 4500000,
              "9월": 4500000,
              "10월": 4500000,
              "11월": 5000000,
              "12월": 4500000
          },
          "SPENDING": {
              "1월": 1120500,
              "2월": 1120500,
              "3월": 1120500,
              "4월": 1120500,
              "5월": 1120500,
              "6월": 1120500,
              "7월": 1120500,
              "8월": 1120500,
              "9월": 1120500,
              "10월": 1120500,
              "11월": 864500,
              "12월": 618500
          }
      })
  })
});

describe('get MonthlyViewByPrivate', () => {
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

  test('SUCCESS :  get MonthlyViewByPrivate', async() => {
    const res = await request(app)
      .get('/flow/view?rule=year&year=2023&unit=private')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send()

      expect(res.status).toBe(200)
      expect(res.body)
        .toEqual({
          "INCOME": {
              "1월": 500000,
              "2월": 600000,
              "3월": 600000,
              "4월": 600000,
              "5월": 600000,
              "6월": 600000,
              "7월": 600000,
              "8월": 600000,
              "9월": 600000,
              "10월": 600000,
              "11월": 600000,
              "12월": 600000
          },
          "SPENDING": {
              "1월": 524500,
              "2월": 524500,
              "3월": 524500,
              "4월": 524500,
              "5월": 524500,
              "6월": 524500,
              "7월": 524500,
              "8월": 524500,
              "9월": 524500,
              "10월": 524500,
              "11월": 524500,
              "12월": 518500
          }
      })
  })
});

describe('get CategoryViewByFamily', () => {
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

  test('SUCCESS :  CategoryViewByFamily', async() => {
    const res = await request(app)
      .get('/flow/view?rule=category&year=2023&month=11&unit=family')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send()

      expect(res.status).toBe(200)
      expect(res.body)
        .toEqual([
          {
              "id": 1,
              "category": "생활비",
              "spending": "99%"
          },
          {
              "id": 2,
              "category": "공과금",
              "spending": "0%"
          },
          {
              "id": 3,
              "category": "기타",
              "spending": "1%"
          }
      ])
  })
});

describe('get CategoryViewByPrivate', () => {
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

  test('SUCCESS :  CategoryViewByPrivate', async() => {
    const res = await request(app)
      .get('/flow/view?rule=category&year=2023&month=11&unit=private')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send()

      expect(res.status).toBe(200)
      expect(res.body)
        .toEqual([
          {
              "id": 1,
              "category": "생활비",
              "spending": "99%"
          },
          {
              "id": 2,
              "category": "공과금",
              "spending": "0%"
          },
          {
              "id": 3,
              "category": "기타",
              "spending": "1%"
          }
      ])
  })
});

describe('get Search', () => {
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

  test('SUCCESS :  Search', async() => {
    const res = await request(app)
      .get('/flow/search?year=2023&month=10&date_order=ASC&choice_user_id=1&flow_type_id=2')
      .set('Authorization', `Bearer ${supplies.token}`)
      .send()

      expect(res.status).toBe(200)
      expect(res.body)
        .toEqual([
          {
              "user_id": 1,
              "name": "김지훈",
              "status": "지출",
              "date": 3,
              "category": "생활비",
              "memo": "인터넷 이용료",
              "amount": 89000,
              "fixed_status": 1
          },
          {
              "user_id": 1,
              "name": "김지훈",
              "status": "지출",
              "date": 4,
              "category": "생활비",
              "memo": "담배",
              "amount": 4500,
              "fixed_status": 0
          },
          {
              "user_id": 1,
              "name": "김지훈",
              "status": "지출",
              "date": 5,
              "category": "생활비",
              "memo": "담배",
              "amount": 4500,
              "fixed_status": 0
          },
          {
              "user_id": 1,
              "name": "김지훈",
              "status": "지출",
              "date": 9,
              "category": "기타",
              "memo": "실내낚시",
              "amount": 6000,
              "fixed_status": 0
          },
          {
              "user_id": 1,
              "name": "김지훈",
              "status": "지출",
              "date": 10,
              "category": "생활비",
              "memo": "담배",
              "amount": 4500,
              "fixed_status": 0
          },
          {
              "user_id": 1,
              "name": "김지훈",
              "status": "지출",
              "date": 11,
              "category": "생활비",
              "memo": "보험료",
              "amount": 398000,
              "fixed_status": 1
          },
          {
              "user_id": 1,
              "name": "김지훈",
              "status": "지출",
              "date": 20,
              "category": "생활비",
              "memo": "담배",
              "amount": 4500,
              "fixed_status": 0
          },
          {
              "user_id": 1,
              "name": "김지훈",
              "status": "지출",
              "date": 20,
              "category": "생활비",
              "memo": "담배",
              "amount": 4500,
              "fixed_status": 0
          },
          {
              "user_id": 1,
              "name": "김지훈",
              "status": "지출",
              "date": 22,
              "category": "생활비",
              "memo": "담배",
              "amount": 4500,
              "fixed_status": 0
          },
          {
              "user_id": 1,
              "name": "김지훈",
              "status": "지출",
              "date": 25,
              "category": "생활비",
              "memo": "담배",
              "amount": 4500,
              "fixed_status": 0
          }
      ])
  })
});