const { appDataSource } = require('../utils/dataSource');
const error = require('../utils/error');

const postFixedMoneyFlow = async (userId, typeId, categoryId, memo, amount, year, month, date) => {
  const result = await appDataSource.query(
    `
    INSERT INTO fixed_money_flows(user_id, flow_type_id, category_id, memo, amount, year, month, date)
    VALUES(?,?,?,?,?,?,?,?)
    `,
    [userId, typeId, categoryId, memo, amount, year, month, date]
  )
  if (result.insertId === 0) {
    error.throwErr(500, 'DATA_INSERTION_FAILED');
  }
  return result.insertId;
}

const postFixedMoneyFlowsGroup = async () => {
  const result = await appDataSource.query(
    `
    INSERT INTO fixed_money_flows_group() 
    VALUES ();
    `
  )
  const mysqlId = result.insertId;
  if (mysqlId === 0) {
    error.throwErr(500, 'DATA_INSERTION_FAILED');
  }
  return mysqlId;
}

const postMiddleFixedMoneyFlow = async (fixedMoneyFlowId, fixedMoneyFlowsGroupId) => {
  const result = await appDataSource.query(
    `
    INSERT INTO middle_fixed_money_flows(fixed_money_flow_id, fixed_money_flow_group_id) 
    VALUES(?,?)
    `,
    [fixedMoneyFlowId, fixedMoneyFlowsGroupId]
  )
  const mysqlId = result.insertId;
  if (mysqlId === 0) {
    error.throwErr(500, 'DATA_INSERTION_FAILED');
  }
  return result;
}

const getFixedMoneyFlows = async(userId) => { // flow_type_id가 1이면 수입, 2이면 지출입니다.
  return await appDataSource.query(
    `
    SELECT id, user_id, flow_type_id, category_id, memo, amount, year, month, date 
    FROM fixed_money_flows 
    WHERE user_id = ?
    ORDER BY year DESC, month DESC, date DESC, amount DESC, flow_type_id, category_id
    `,
    [ userId ]
  )
}

module.exports = {
  postFixedMoneyFlow,
  postFixedMoneyFlowsGroup,
  postMiddleFixedMoneyFlow,
  getFixedMoneyFlows
}
