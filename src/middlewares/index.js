const jwt = require('jsonwebtoken');
const { v4 } = require('uuid');
const secretKey = process.env.TYPEORM_SECRET_KEY;

const queryBuilder1 = async (data) => {
  let query = 'SELECT';
  query = query + ' mf.user_id, u.name, ft.status, mf.date, c.category, mf.memo, mf.amount';
  query = query + ' FROM money_flows mf';
  query = query + ' JOIN categories c ON mf.category_id = c.id';
  query = query + ' JOIN flow_type ft ON mf.flow_type_id = ft.id';
  query = query + ' JOIN users_families uf ON mf.user_id = uf.user_id';
  query = query + ' JOIN users u ON mf.user_id = u.id';
  query = query + ` WHERE mf.year = ${data.year}`;
  query = query + ` AND mf.month = ${data.month}`;
  query = query + ` AND uf.family_id = ${data.familyId}`;
  if (data.flowTypeId) {
    query = query + ` AND mf.flow_type_id = ${data.flowTypeId}`;
  }
  if (data.userId) {
    query = query + ` AND uf.user_id = ${data.userId}`;
  }
  if (data.categoryId) {
    query = query + ` AND c.id = ${data.categoryId}`;
  }
  if (data.memo) {
    query = query + ` AND mf.memo LIKE '%${data.memo}%'`;
  }
  query = query + ` ORDER BY mf.date ${data.dateOrder}`;

  return query;
};

const queryBuilder2 = async (data) => {
  let query = 'SELECT';
  query = query + ' fmf.user_id, u.name, ft.status, fmf.date, c.category, fmf.memo, fmf.amount';
  query = query + ' FROM fixed_money_flows fmf';
  query = query + ' JOIN categories c ON fmf.category_id = c.id';
  query = query + ' JOIN flow_type ft ON fmf.flow_type_id = ft.id';
  query = query + ' JOIN users_families uf ON fmf.user_id = uf.user_id';
  query = query + ' JOIN users u ON fmf.user_id = u.id';
  query = query + ` WHERE fmf.year = ${data.year}`;
  query = query + ` AND fmf.month = ${data.month}`;
  query = query + ` AND uf.family_id = ${data.familyId}`;
  if (data.flowTypeId) {
    query = query + ` AND fmf.flow_type_id = ${data.flowTypeId}`;
  }
  if (data.userId) {
    query = query + ` AND uf.user_id = ${data.userId}`;
  }
  if (data.categoryId) {
    query = query + ` AND c.id = ${data.categoryId}`;
  }
  if (data.memo) {
    query = query + ` AND fmf.memo LIKE '%${data.memo}%'`;
  }
  query = query + ` ORDER BY fmf.date ${data.dateOrder}`;
  return query;
};

const createToken = (email) => {
  return jwt.sign({ email }, secretKey, { expiresIn: '1h' });
};

const createCustomUuid = () => {
  const uuid = v4().split('-');
  const customUuid = uuid[0] + uuid[1];

  return customUuid.slice(8);
};

module.exports = {
  queryBuilder1,
  queryBuilder2,
  createToken,
  createCustomUuid,
};
