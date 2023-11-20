const request = require('supertest');
const { createApp } = require('../app');
const { appDataSource } = require('../src/utils/dataSource');
const supplies = require('./testSupplies.js')

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
