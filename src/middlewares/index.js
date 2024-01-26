const jwt = require('jsonwebtoken');
const { v4 } = require('uuid');
const secretKey = process.env.TYPEORM_SECRET_KEY;

class QueryBuilder {
  constructor(data, tableName) {
    this._data = data;
    this._tableName = tableName;
  }

  buildMoneyFLowsQuery() {
    let conditions = [
      `${this._tableName === 'money_flows' ? 'mf' : 'fmf'}.year = ${this._data.year}`,
      `${this._tableName === 'money_flows' ? 'mf' : 'fmf'}.month = ${this._data.month}`,
      `uf.family_id = ${this._data.familyId}`,
    ];

    if (this._data.flowTypeId)
      conditions.push(
        `${this._tableName === 'money_flows' ? 'mf' : 'fmf'}.flow_type_id = ${this._data.flowTypeId}`,
      );
    if (this._data.userId) conditions.push(`uf.user_id = ${this._data.userId}`);
    if (this._data.categoryId) conditions.push(`c.id = ${this._data.categoryId}`);
    if (this._data.memo)
      conditions.push(
        `${this._tableName === 'money_flows' ? 'mf' : 'fmf'}.memo LIKE '%${this._data.memo}%'`,
      );

    let query = `
      SELECT 
        ${this._tableName === 'money_flows' ? 'mf' : 'fmf'}.user_id, 
        u.name, 
        ft.status, 
        ${this._tableName === 'money_flows' ? 'mf' : 'fmf'}.date, 
        c.category, 
        ${this._tableName === 'money_flows' ? 'mf' : 'fmf'}.memo, 
        ${this._tableName === 'money_flows' ? 'mf' : 'fmf'}.amount
      FROM 
        ${this._tableName === 'money_flows' ? 'money_flows mf' : 'fixed_money_flows fmf'}
        JOIN categories c ON ${this._tableName === 'money_flows' ? 'mf' : 'fmf'}.category_id = c.id
        JOIN flow_type ft ON ${this._tableName === 'money_flows' ? 'mf' : 'fmf'}.flow_type_id = ft.id
        JOIN users_families uf ON ${this._tableName === 'money_flows' ? 'mf' : 'fmf'}.user_id = uf.user_id
        JOIN users u ON ${this._tableName === 'money_flows' ? 'mf' : 'fmf'}.user_id = u.id
      WHERE 
        ${conditions.join(' AND ')}
    `;

    query += ` ORDER BY ${this._tableName === 'money_flows' ? 'mf' : 'fmf'}.date ${this._data.dateOrder}`;

    return query;
  }
}

const createToken = (email) => {
  return jwt.sign({ email }, secretKey, { expiresIn: '1h' });
};

const createCustomUuid = () => {
  const uuid = v4().split('-');
  const customUuid = uuid[0] + uuid[1];

  return customUuid.slice(8);
};

module.exports = {
  QueryBuilder,
  createToken,
  createCustomUuid,
};
