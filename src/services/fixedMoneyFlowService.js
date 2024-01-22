const fixedMoneyFlowDao = require('../models/fixedMoneyFlowDao');
const categoryService = require('../services/categoryService');
const flowTypeService = require('../services/flowTypeService');
const error = require('../utils/error');
const { appDataSource } = require('../utils/dataSource');
const { MoneyFlowHandler } = require('../utils/arrayUtil');

const postFixedMoneyFlows = async (
  userId,
  type,
  categoryId,
  memo,
  amount,
  startYear,
  startMonth,
  startDate,
  endYear,
  endMonth,
) => {
  try {
    const typeId = await flowTypeService.getIdByFlowStatus(type);
    const integerStartYear = parseInt(startYear);
    const integerStartMonth = parseInt(startMonth);
    const integerStartDate = parseInt(startDate);
    const integerEndYear = parseInt(endYear);
    const integerEndMonth = parseInt(endMonth);
    const result = []; // 결과값

    await appDataSource.transaction(async (transaction) => {
      if (integerEndYear - integerStartYear > 0) {
        for (let k = integerStartYear; k <= integerEndYear; k++) {
          // insertId를 바로 result array에 push합니다.
          if (k === integerStartYear) {
            for (let i = integerStartMonth; i <= 12; i++) {
              result.push(
                await fixedMoneyFlowDao.postFixedMoneyFlow(
                  userId,
                  typeId,
                  categoryId,
                  memo,
                  amount,
                  k,
                  i,
                  integerStartDate,
                  transaction,
                ),
              );
            }
          } else if (integerStartYear < k < integerEndYear) {
            for (let l = 1; l <= 12; l++) {
              result.push(
                await fixedMoneyFlowDao.postFixedMoneyFlow(
                  userId,
                  typeId,
                  categoryId,
                  memo,
                  amount,
                  k,
                  l,
                  integerStartDate,
                  transaction,
                ),
              );
            }
          } else if (k === integerEndYear) {
            for (let n = 1; n <= integerEndMonth; n++) {
              result.push(
                await fixedMoneyFlowDao.postFixedMoneyFlow(
                  userId,
                  typeId,
                  categoryId,
                  memo,
                  amount,
                  k,
                  n,
                  integerStartDate,
                  transaction,
                ),
              );
            }
          }
        }
      } else if (integerEndYear === integerStartYear) {
        if (endMonth > integerStartMonth) {
          for (let m = integerStartMonth; m <= integerEndMonth; m++) {
            result.push(
              await fixedMoneyFlowDao.postFixedMoneyFlow(
                userId,
                typeId,
                categoryId,
                memo,
                amount,
                integerStartYear,
                m,
                integerStartDate,
                transaction,
              ),
            );
          }
        } else {
          error.throwErr(400, '마감월은 시작월보다 뒤여야 합니다');
        }
      } else if (integerEndYear < integerStartYear) {
        error.throwErr(400, '마감년도는 시작년도 이후여야 합니다');
      }

      const fixedMoneyFlowIds = result; // 결과값을 반환합니다. fixed_money_flows 에 POST 한 id 값들의 모음입니다.
      const groupId = await fixedMoneyFlowDao.postFixedMoneyFlowsGroup(transaction); // Dao 에서 만든 fixed_money_flows_group 의 insertId를 반환합니다.
      for (const fixedMoneyFlowId of fixedMoneyFlowIds) {
        await fixedMoneyFlowDao.postMiddleFixedMoneyFlow(fixedMoneyFlowId, groupId, transaction);
      }
      return 'POST_SUCCESS';
    });
  } catch (err) {}
};

const getFixedMoneyFlows = async (userId) => {
  const flows = await fixedMoneyFlowDao.getFixedMoneyFlows(userId);
  return await MoneyFlowHandler.mapMoneyFlows(flows);
};

const getFixedMoneyFlowsByYearMonth = async (userId, year, month) => {
  // 월 별 고정 수입/지출 내역들을 반환합니다.
  const flows = await fixedMoneyFlowDao.getFixedMoneyFlowsByYearMonth(userId, year, month);
  return await MoneyFlowHandler.mapMoneyFlows(flows);
};

const getUsedFixedMoneyFlowsByYearMonthAndGetAmount = async (userId, year, month) => {
  // 월 별 고정 지출 사용량을 합산합니다.
  let typeId = 2;
  const flows = await fixedMoneyFlowDao.getUsedOrGotFixedMoneyFlowsByYearMonth(
    userId,
    typeId,
    year,
    month,
  );
  return flows.reduce((acc, allowance) => acc + allowance.amount, 0);
};

const getFixedMoneyFlowsByYearDate = async (userId, year, date) => {
  // 특정 연도의 특정 날짜별 고정 지출/수입 내역을 찾습니다.
  const flows = await fixedMoneyFlowDao.getFixedMoneyFlowsByYearDate(userId, year, date);
  return await MoneyFlowHandler.mapMoneyFlows(flows);
};

const getFixedMoneyFlowsByYearMonthDate = async (userId, year, month, date) => {
  const flows = await fixedMoneyFlowDao.getFixedMoneyFlowsByYearMonthDate(
    userId,
    year,
    month,
    date,
  );
  return await MoneyFlowHandler.mapMoneyFlows(flows);
};

const getGroupIdByFlowId = async (fixedFlowId) => {
  // 고정 수입/지출 내역이 속한 group 의 id를 찾습니다.
  const groupId = await fixedMoneyFlowDao.getGroupIdByFlowId(fixedFlowId);
  if (!(await groupId.length)) {
    error.throwErr(404, 'NOT_EXISTING');
  }
  return await groupId[0]['groupId'];
};

const getFlowIdsByGroupId = async (groupId) => {
  // group 내에 속해 있는 모든 고정 수입/지출 내역의 id를 찾습니다.
  const fixedFlowIdsObj = await fixedMoneyFlowDao.getFlowIdsByGroupId(groupId);
  return Promise.all(fixedFlowIdsObj.map((fixedFlowObj) => fixedFlowObj['flowId']));
};

const updateFixedMoneyFlows = async (flowIds, amount, type, category, memo) => {
  try {
    const categoryId = await categoryService.getIdByCategoryName(category);
    const typeId = await flowTypeService.getIdByFlowStatus(type);

    await appDataSource.transaction(async (transaction) => {
      for (const flowId of flowIds) {
        await fixedMoneyFlowDao.updateFixedMoneyFlows(
          flowId,
          amount,
          typeId,
          categoryId,
          memo,
          transaction,
        );
      }
    });

    return 'SUCCESS';
  } catch (err) {}
};

const deleteFixedMoneyFlows = async (flowIds, groupId, year, month, date) => {
  // 고정 수입/지출 내역 삭제 대상을 찾고, 같은 조건으로 연관 데이터들의 삭제를 조건에 따라 진행합니다.
  try {
    const deleteTargetIds = await Promise.all(
      flowIds.map(async (flowId) => {
        // 삭제 대상 고정 수입/지출 내역 ids 의 배열을 찾습니다.
        const flowIdObj = await fixedMoneyFlowDao.selectDeleteTargetFixedMoneyFlowsByDate(
          flowId,
          year,
          month,
          date,
        );
        return flowIdObj.id;
      }),
    );

    const setDeleteTargetIds = new Set(deleteTargetIds); // set으로 삭제 대상 Ids array의 순서를 없앱니다.

    // every(..)의 arrow target이 Promise<boolean>을 return할 때는 때는 await을 걸어야 한다. // Set.has()를 사용하면 .every(..)는 O(n)의 복잡도를 갖는다. 전체 삭제가 아닌 경우도 절반 이상이면 시간 복잡도는 평균적으로 O(n^2)와 O(n)의 중간에 분포할 것이다.
    const areArraysEqual =
      flowIds.length === deleteTargetIds.length &&
      flowIds.every((id) => setDeleteTargetIds.has(id)); // 두 배열을 비교합니다. 이 때, 삭제 대상이 그룹 내 전체 고정 수입/지출 내역이면 해당 group 의 data 도 삭제합니다. (조건 1)

    await appDataSource.transaction(async (transaction) => {
      await transaction.query('SET foreign_key_checks = 0');
      await Promise.all(
        flowIds.map(async (flowId) => {
          // 삭제 대상 고정 수입/지출 내역을 삭제합니다.
          await fixedMoneyFlowDao.deleteFixedMoneyFlowsByDate(
            flowId,
            year,
            month,
            date,
            transaction,
          );
        }),
      );

      await Promise.all(
        deleteTargetIds.map(async (ids) => {
          // 삭제 대상 고정 수입/지출 내역과, 해당 그룹의 중간 테이블의 데이터를 삭제합니다.
          await fixedMoneyFlowDao.deleteMiddleFixedFlowsByIds(ids, groupId, transaction);
        }),
      );

      if (areArraysEqual) {
        await fixedMoneyFlowDao.deleteFixedMoneyFlowsGroupById(groupId, transaction); // 삭제 대상이 그룹 내 전체 fixedFlows 면, group 의 data 도 삭제합니다.
      }

      await transaction.query('SET foreign_key_checks = 1');
      return 'DELETE_SUCCESS';
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  postFixedMoneyFlows,
  getFixedMoneyFlows,
  getFixedMoneyFlowsByYearMonth,
  getUsedFixedMoneyFlowsByYearMonthAndGetAmount,
  getFixedMoneyFlowsByYearDate,
  getFixedMoneyFlowsByYearMonthDate,
  getGroupIdByFlowId,
  getFlowIdsByGroupId,
  updateFixedMoneyFlows,
  deleteFixedMoneyFlows,
};
