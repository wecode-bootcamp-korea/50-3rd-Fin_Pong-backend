const jwt = require('jsonwebtoken');
const { v4 } = require('uuid');
const secretKey = process.env.TYPEORM_SECRET_KEY;

const queryBuilder1 = async (data) => {
  let query = `
    SELECT 
      mf.user_id, 
      u.name, 
      ft.status, 
      mf.date, 
      c.category, 
      mf.memo, 
      mf.amount
    FROM 
      money_flows mf
      JOIN categories c ON mf.category_id = c.id
      JOIN flow_type ft ON mf.flow_type_id = ft.id
      JOIN users_families uf ON mf.user_id = uf.user_id
      JOIN users u ON mf.user_id = u.id
    WHERE 
      mf.year = ${data.year}
      AND mf.month = ${data.month}
      AND uf.family_id = ${data.familyId}
  `;

  if (data.flowTypeId) query += ` AND mf.flow_type_id = ${data.flowTypeId}`;
  if (data.userId) query += ` AND uf.user_id = ${data.userId}`;
  if (data.categoryId) query += ` AND c.id = ${data.categoryId}`;
  if (data.memo) query += ` AND mf.memo LIKE '%${data.memo}%'`;

  query += ` ORDER BY mf.date ${data.dateOrder}`;

  return query;
};

const queryBuilder2 = async (data) => {
  let query = `
    SELECT 
      fmf.user_id, 
      u.name, 
      ft.status, 
      fmf.date, 
      c.category, 
      fmf.memo, 
      fmf.amount 
    FROM 
      fixed_money_flows fmf 
      JOIN categories c ON fmf.category_id = c.id 
      JOIN flow_type ft ON fmf.flow_type_id = ft.id 
      JOIN users_families uf ON fmf.user_id = uf.user_id 
      JOIN users u ON fmf.user_id = u.id 
    WHERE 
      fmf.year = ${data.year} 
      AND fmf.month = ${data.month} 
      AND uf.family_id = ${data.familyId}
  `;

  if (data.flowTypeId) query += ` AND fmf.flow_type_id = ${data.flowTypeId}`;
  if (data.userId) query += ` AND uf.user_id = ${data.userId}`;
  if (data.categoryId) query += ` AND c.id = ${data.categoryId}`;
  if (data.memo) query += ` AND fmf.memo LIKE '%${data.memo}%'`;

  query += ` ORDER BY fmf.date ${data.dateOrder}`;
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
