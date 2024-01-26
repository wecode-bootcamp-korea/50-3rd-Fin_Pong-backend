const moneyFlowDao = require('../models/moneyFlowDao');
const fixedMoneyFlowDao = require('../models/fixedMoneyFlowDao');
const allowanceDao = require('../models/allowanceDao');
const { QueryBuilder } = require('../middlewares/index');
const flowTypeService = require('../services/flowTypeService');
const categoryDao = require('../models/categoryDao');
const budgetDao = require('../models/budgetDao');
const error = require('../utils/error');
const {
  MoneyFlowHandler,
  CategorySetHandler,
  ConcatenatedMoneyFlowsHandler,
} = require('../utils/arrayUtil');

const getOrderedMoneyFlows = async (data) => {
  const moneyFlowsQueryBuilder = new QueryBuilder(data, 'money_flows');
  const fixedMoneyFLowsQueryBuilder = new QueryBuilder(data, 'fixed_money_flows');

  const queryMoneyFlows = moneyFlowsQueryBuilder.buildMoneyFLowsQuery();
  const resultMoneyFlows = await moneyFlowDao.getConditionalGeneralInfo(queryMoneyFlows);
  for (const element of resultMoneyFlows) {
    element.fixed_status = 0;
  }

  const queryFixedMoneyFLows = fixedMoneyFLowsQueryBuilder.buildMoneyFLowsQuery(
    data,
    'fixed_money_flows',
  );
  const resultFixedMoneyFlows = await moneyFlowDao.getConditionalFixedInfo(queryFixedMoneyFLows);
  for (const element of resultFixedMoneyFlows) {
    element.fixed_status = 1;
  }

  const everyMoneyFlowsResults = resultMoneyFlows.concat(resultFixedMoneyFlows);

  return everyMoneyFlowsResults.sort((a, b) => {
    return data.dateOrder === 'DESC' ? b.date - a.date : a.date - b.date;
  });
};

const getChartDataByYear = async (userId, familyId, year) => {
  let monthlyIncome = [];
  let generalConsumption = [];
  let fixedConsumption = [];
  let monthlyConsumption = [];

  // const monthNums = Array.from({ length: 12 }, (_, index) => index + 1);
  // 숫자가 많아지면 직접 쓰기 힘듭니다.

  if (familyId) {
    try {
      [monthlyIncome, generalConsumption, fixedConsumption] = await Promise.all([
        budgetDao.getBudgetAsIncomeByFamilyByYear(familyId, year),
        moneyFlowDao.getSumOfGeneralMoneyFlowsByFamilyByYearByMonthGroup(2, familyId, year),
        fixedMoneyFlowDao.getFixedMoneyFlowsSumByFamilyByYearByMonthGroup(2, familyId, year),
      ]);
    } catch (err) {
      console.error('ERROR_FETCHING_FAMILY_ANALYTICS', err);
    }

    if (generalConsumption.length && fixedConsumption.length) {
      // 일반, 고정 수입/지출 데이터 둘 다 존재할 경우
      for (let month = 1; month <= 12; month++) {
        if (!generalConsumption.find((item) => item.month === month)) {
          generalConsumption.push({
            familyId: familyId,
            month: month,
            spending: 0,
          });
        }

        if (!fixedConsumption.find((item) => item.month === month)) {
          fixedConsumption.push({
            familyId: familyId,
            month: month,
            spending: 0,
          });
        }
      }

      /**
       * 두 배열을 12개의 원소를 월별로 오름차순으로 정렬하지 않고 원소를 할당하는 코드로 확장될 경우에 대비하여
       * .find()를 사용하는 방식으로 전환하였습니다.
       */
      monthlyConsumption = generalConsumption.map((generalConsumption) => {
        const matchingFixedConsumption = fixedConsumption.find(
          (fixedConsumption) => fixedConsumption.month === generalConsumption.month,
        );
        return {
          family_id: familyId,
          month: generalConsumption.month,
          spending:
            Number(generalConsumption.spending) +
            (matchingFixedConsumption ? Number(matchingFixedConsumption.spending) : 0),
        };
      });
    } else if (!generalConsumption.length && !fixedConsumption.length) {
      // 둘 다 data가 없을 경우 빠르게
      console.log(
        `${familyId}번 가족의 ${year}년도의 예산 및 지출 데이터는 없습니다.\nProcess Starts`,
      ); // 가족 전체의 수입/지출 내역이 전혀 없을 경우, db에서 아무것도 조회되지 않았음을 로그에 찍어 Mysql Server 부하로 인한 붕괴 error case와 구분하기 편하게 하기 위해서 작성하였습니다.
      let _month = 1;

      while (_month <= 12) {
        console.log(`\nprocess ${_month}월 진행 중 ...`);

        monthlyConsumption.push({
          familyId: familyId,
          month: _month,
          spending: 0,
        });
        console.log(`\nprocess ${_month}월 진행 완료`);
        _month++;
      }
      console.log('Process Ends');
    }
  }
  // family에 가입하지 않은 사용자의 용돈을 기준으로 data call
  else if (userId) {
    try {
      [monthlyIncome, generalConsumption, fixedConsumption] = await Promise.all([
        allowanceDao.getMonthlyAllowancesByPrivate(userId, year),
        moneyFlowDao.getSumOfGeneralMoneyFlowsByPrivateByYearByMonthGroup(2, userId, year),
        fixedMoneyFlowDao.getFixedMoneyFlowsSumByPrivateByYearByMonthGroup(2, userId, year),
      ]);
    } catch (err) {
      console.error('ERROR_FETCHING_USER_ANALYTICS', err);
    }

    if (generalConsumption.length && fixedConsumption.length) {
      // 일반, 고정 수입/지출 데이터 둘 다 존재할 경우
      for (let month = 1; month <= 12; month++) {
        if (!generalConsumption.find((item) => item.month === month)) {
          generalConsumption.push({
            userId: userId,
            month: month,
            spending: 0,
          });
        }

        if (!fixedConsumption.find((item) => item.month === month)) {
          fixedConsumption.push({ userId: userId, month: month, spending: 0 });
        }
      }

      /**
       * 두 배열을 12개의 원소를 월별로 오름차순으로 정렬하지 않고 원소를 할당하는 코드로 확장될 경우에 대비하여
       * .find()를 사용하는 방식으로 전환하였습니다.
       */
      monthlyConsumption = generalConsumption.map((generalConsumption) => {
        const matchingFixedConsumption = fixedConsumption.find(
          (fixedConsumption) => fixedConsumption.month === generalConsumption.month,
        );
        return {
          userId: userId,
          month: generalConsumption.month,
          spending:
            Number(generalConsumption.spending) +
            (matchingFixedConsumption ? Number(matchingFixedConsumption.spending) : 0),
        };
      });
    } else if (!generalConsumption.length && !fixedConsumption.length) {
      // 둘 다 data가 없을 경우 빠르게
      console.log(
        `${userId}번 사용자의 ${year}년도의 용돈 및 지출 데이터는 없습니다.\nProcess Starts`,
      ); // 개인의 수입/지출 내역이 전혀 없을 경우, db에서 아무것도 조회되지 않았음을 로그에 찍어 Mysql Server 부하로 인한 붕괴 error case와 구분하기 편하게 하기 위해서 작성하였습니다.
      let _month = 1;

      while (_month <= 12) {
        console.log(`\nprocess ${_month}월 진행 중 ...`);

        monthlyConsumption.push({
          userId: userId,
          month: _month,
          spending: 0,
        });
        console.log(`\nprocess ${_month}월 진행 완료`);
        _month++;
      }
      console.log('Process Ends');
    }
  }

  let incomeTable = {};
  for (const element of monthlyIncome) {
    incomeTable[element.month + '월'] = element['income'];
  }
  let _i = 1;
  while (_i < 12) {
    if (!incomeTable[_i + '월']) {
      incomeTable[_i + '월'] = 0;
    }
    _i++;
  }

  let spendingTable = {};
  for (const element of monthlyConsumption) {
    spendingTable[element.month + '월'] = element.spending;
  }
  let _j = 1;
  while (_j < 12) {
    if (!incomeTable[_i + '월']) {
      incomeTable[_i + '월'] = 0;
    }
    _j++;
  }

  return [incomeTable, spendingTable];
};

const getChartDataByCategory = async (userId, familyId, year, month) => {
  let result = [];
  let result1 = [];
  let result2 = [];
  if (familyId) {
    [result1, result2] = await Promise.all([
      await moneyFlowDao.getSumOfGeneralMoneyFlowsByFamilyByYearMonthByCategoryGroup(
        2,
        familyId,
        year,
        month,
      ),
      await fixedMoneyFlowDao.getFixedMoneyFlowsSumByFamilyByYearMonthByCategoryGroup(
        2,
        familyId,
        year,
        month,
      ),
    ]);

    result = await CategorySetHandler.changeArraysIntoCategorySetArray(result1, result2);
  } else if (userId) {
    [result1, result2] = await Promise.all([
      await moneyFlowDao.getSumOfGeneralMoneyFlowsByPrivateByYearMonthByCategoryGroup(
        2,
        userId,
        year,
        month,
      ),
      await fixedMoneyFlowDao.getFixedMoneyFlowsSumByPrivateByYearMonthByCategoryGroup(
        2,
        userId,
        year,
        month,
      ),
    ]);

    result = await CategorySetHandler.changeArraysIntoCategorySetArray(result1, result2);
  }

  const categories = await categoryDao.getCategories();
  const sumOfFlowsByCategory = await Promise.all(
    categories.map(async (category) => {
      //  0이어서 db에서 안 나온 category는 spending: 0, 카테고리에 지출이 있어서 find()에 걸리면 그 값을 더해 줍니다.
      const matchingResults = result.map((groupResults) =>
        groupResults.find((element) => element.category === category.category),
      );

      const totalConsumptionByCategory = matchingResults.reduce(
        (sum, element) => sum + (element ? element.spending : 0),
        0,
      );

      return {
        ...category,
        spending: totalConsumptionByCategory,
      };
    }),
  );

  const totalConsumption = sumOfFlowsByCategory.reduce((sum, element) => sum + element.spending, 0);

  return sumOfFlowsByCategory.map((category) => ({
    // totalConsumption이 0일 때, 카테고리별 지출이 0으로 할당됩니다.
    ...category,
    spending:
      totalConsumption !== 0
        ? `${Math.round((Number(category.spending) * 100) / totalConsumption)}%`
        : '0%',
  }));
};

const postMoneyFlow = async (userId, type, categoryId, memo, amount, year, month, date) => {
  const typeId = await flowTypeService.getIdByFlowStatus(type);
  if (!typeId) {
    error.throwErr(404, 'NOT_EXISTING_TYPE');
  }
  return await moneyFlowDao.postMoneyFlow(
    userId,
    typeId,
    categoryId,
    memo,
    amount,
    year,
    month,
    date,
  );
};

const getMoneyFlowsByUserId = async (userId) => {
  // userId를 가진 사용자의 수입/지출 내역을 전부 조회합니다.
  return await MoneyFlowHandler.mapMoneyFlows(await moneyFlowDao.getMoneyFlowsByUserId(userId));
};

const getMoneyFlowsByFamilyUserIds = async (familyUserIds) => {
  // 가족에 포함된 사용자들의 수입/지출 내역을 조회합니다.
  return await ConcatenatedMoneyFlowsHandler.concatMoneyFlowsArrays(
    familyUserIds,
    moneyFlowDao.getMoneyFlowsByUserId,
    familyUserIds,
  );
};

const getMoneyFlowsByFamilyUserIdByYear = async (familyUserIds, year) => {
  return await ConcatenatedMoneyFlowsHandler.concatMoneyFlowsArrays(
    familyUserIds,
    moneyFlowDao.getMoneyFlowsByUserIdByYear,
    year,
  );
};

const getMoneyFlowsByUserIdByYear = async (userId, year) => {
  return await MoneyFlowHandler.mapMoneyFlows(
    await moneyFlowDao.getMoneyFlowsByUserIdByYear(userId, year),
  );
};

const getMoneyFlowsByUserIdByYearMonth = async (userId, year, month) => {
  return await MoneyFlowHandler.mapMoneyFlows(
    await moneyFlowDao.getMoneyFlowsByUserIdByYearMonth(userId, year, month),
  );
};

const getMoneyFlowsByFamilyUserIdByYearMonth = async (familyUserIds, year, month) => {
  return await ConcatenatedMoneyFlowsHandler.concatMoneyFlowsArrays(
    familyUserIds,
    moneyFlowDao.getMoneyFlowsByUserIdByYearMonth,
    year,
    month,
  );
};

const getUsedMoneySumFlowsByYearMonth = async (userId, year, month) => {
  let flowTypeId = 2;
  const flows = await moneyFlowDao.getUsedOrGotMoneyFlowsByUserIdByYearMonth(
    userId,
    flowTypeId,
    year,
    month,
  );
  return await flows.reduce((acc, flow) => acc + flow.amount, 0);
};

const getMoneyFlowsByUserIdByYearDate = async (userId, year, date) => {
  return await MoneyFlowHandler.mapMoneyFlows(
    await moneyFlowDao.getMoneyFlowsByUserIdByYearDate(userId, year, date),
  );
};

const getMoneyFlowsByFamilyUserIdByYearDate = async (familyUserIds, year, date) => {
  return await ConcatenatedMoneyFlowsHandler.concatMoneyFlowsArrays(
    await moneyFlowDao.getMoneyFlowsByUserIdByYearDate,
    year,
    date,
  );
};

const getMoneyFlowsByUserIdByYearMonthDate = async (userId, year, month, date) => {
  return await MoneyFlowHandler.mapMoneyFlows(
    await moneyFlowDao.getMoneyFlowsByUserIdByYearMonthDate(userId, year, month, date),
  );
};

const getMoneyFlowsByFamilyUserIdsByYearMonthDate = async (familyUserIds, year, month, date) => {
  return await ConcatenatedMoneyFlowsHandler.concatMoneyFlowsArrays(
    familyUserIds,
    moneyFlowDao.getMoneyFlowsByUserIdByYearMonthDate,
    year,
    month,
    date,
  );
};

const updateMoneyFlow = async (id, userId, type, categoryId, memo, amount, year, month, date) => {
  const typeId = await flowTypeService.getIdByFlowStatus(type);
  if (!typeId) {
    error.throwErr(404, 'NOT_EXISTING_TYPE');
  }
  return await moneyFlowDao.updateMoneyFlow(
    id,
    userId,
    typeId,
    categoryId,
    memo,
    amount,
    year,
    month,
    date,
  );
};

const deleteMoneyFlow = async (id, userId) => {
  return await moneyFlowDao.deleteMoneyFlow(id, userId);
};

module.exports = {
  search: getOrderedMoneyFlows,
  getChartDataByYear,
  getChartDataByCategory,
  postMoneyFlow,
  getMoneyFlowsByUserId,
  getMoneyFlowsByFamilyUserIds,
  getMoneyFlowsByUserIdByYear,
  getMoneyFlowsByFamilyUserIdByYear,
  getMoneyFlowsByUserIdByYearMonth,
  getMoneyFlowsByFamilyUserIdByYearMonth,
  getMoneyFlowsByUserIdByYearDate,
  getMoneyFlowsByFamilyUserIdByYearDate,
  getMoneyFlowsByUserIdByYearMonthDate,
  getUsedMoneySumFlowsByYearMonth,
  getMoneyFlowsByFamilyUserIdsByYearMonthDate,
  updateMoneyFlow,
  deleteMoneyFlow,
};
