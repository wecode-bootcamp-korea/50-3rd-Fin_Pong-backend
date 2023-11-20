const request = require('supertest');

const { createApp } = require('../app');
const { testDataSource } = require('../src/utils/dataSource');
describe('createdUserFamily', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await testDataSource.initialize();

    await testDataSource.query(`
      INSERT INTO users (email)
      VALUES ('jwk2345@naver.com');
    `);
    await testDataSource.query(`
      INSERT INTO families(auth_code)
      VALUES ('SD2E55EA');
    `);
    await testDataSource.query(`
      INSERT INTO roles (name)
      VALUES ('관리자');
    `);
    await testDataSource.query(`
      INSERT INTO users_families (user_id, family_id, role_id)
      VALUES (1, 1, 1);
    `);
  });

  afterEach(async () => {
    await testDataSource.query(`SET foreign_key_checks = 0;`);
    await testDataSource.query(`TRUNCATE users`);
    await testDataSource.query(`TRUNCATE users_families`);
    await testDataSource.query(`TRUNCATE families`);
    await testDataSource.query(`SET foreign_key_checks = 1;`);
    await testDataSource.destroy();
  });

  test('SUCCESS:posts', async () => {
    const res = await request(app)
      .post("/family/book")
      .send({
        "message": "AUTH_CODE_CREATED_SUCCESS",
        "authcode": "22ff91ba"
      })
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZpdmVzbEBnbWFpbC5jb20iLCJpYXQiOjE3MDAxNDkxNDgsImV4cCI6MTcwODc4OTE0OH0.zKJwfkJRsm6FcUF5lnIb-xSSgRYL9QCN2eNxEIIJVvc');
  
    expect(res.body).toEqual({
      'message': 'invalid signature'
    });
  });
});

describe('FindUserFamily', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await testDataSource.initialize();

    await testDataSource.query(`
      INSERT INTO users (email)
      VALUES ('jmej52@gmail.com');
    `);
    await testDataSource.query(`
      INSERT INTO families(auth_code)
      VALUES ('SD2E55EA');
    `);
    await testDataSource.query(`
      INSERT INTO roles (name)
      VALUES ('참여자');
    `);
    const roleIdResult = await testDataSource.query(`
    SELECT id FROM roles WHERE name = '참여자';
`);
const roleId = roleIdResult[0].id;

    const familyResult = await testDataSource.query(`
      SELECT id 
      FROM families WHERE auth_code = 'SD2E55EA';
    `);
    const familyId = familyResult[0].id;

    await testDataSource.query(`
      INSERT INTO users_families (user_id, family_id, role_id)
      VALUES (1, ${familyId}, ${roleId});
    `);
  });

  afterEach(async () => {
    await testDataSource.query(`SET foreign_key_checks = 0;`);
    await testDataSource.query(`TRUNCATE users`);
    await testDataSource.query(`TRUNCATE users_families`);
    await testDataSource.query(`TRUNCATE families`);
    await testDataSource.query(`SET foreign_key_checks = 1;`);
    await testDataSource.destroy();
  });

  test('SUCCESS:posts', async () => {
    const res = await request(app)
      .post("/family/book")
      .send({
        "message": "JOIN_SUCCESS"
      })
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZpdmVzbEBnbWFpbC5jb20iLCJpYXQiOjE3MDAxNDkxNDgsImV4cCI6MTcwODc4OTE0OH0.zKJwfkJRsm6FcUF5lnIb-xSSgRYL9QCN2eNxEIIJVvc');
  
    expect(res.body).toEqual({
      'message': 'invalid signature'
    });
  });
});

