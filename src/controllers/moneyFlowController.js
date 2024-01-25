const moneyFlowService = require('../services/moneyFlowService');
const categoryService = require('../services/categoryService');
const usersFamilyService = require('../services/usersFamilyService');
const error = require('../utils/error');
const { httpResponseHandler, MoneyFlowResponseHandler } = require('../utils/response');

const search = async (req, res) => {
  try {
    const { familyId } = req.userData;
    if (!req.query.year || !req.query.month) {
      error.throwErr(400, 'KEY_ERROR');
    }
    const data = {
      year: Number(req.query.year),
      month: Number(req.query.month),
      dateOrder: req.query['date_order'] || 'DESC',
      choiceUserId: Number(req.query['choice_user_id']),
      categoryId: Number(req.query['category_id']),
      flowTypeId: Number(req.query['flow_type_id']),
      memo: req.query.memo,
      userId: Number(req.query['choice_user_id']),
      familyId: Number(familyId),
    };
    const result = await moneyFlowService.search(data);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message || 'INTERNAL_SERVER_ERROR' });
  }
};

const getChartDataOfMoneyFlows = async (req, res) => {
  try {
    const { familyId, userId } = req.userData;
    if (!req.query.rule || !req.query.year || !req.query.unit) {
      error.throwErr(400, 'KEY_ERROR');
    }
    const { year: year, month: month = '', rule: rule, unit: unit } = req.query;

    if (rule === 'year' && unit === 'family') {
      const result = await moneyFlowService.getChartDataByYear(undefined, familyId, year);

      return httpResponseHandler.sendSuccessResponse(
        res,
        200,
        'GET',
        'INCOME',
        result[0],
        'SPENDING',
        result[1],
      );
    } else if (rule === 'year' && unit === 'private') {
      const result = await moneyFlowService.getChartDataByYear(userId, undefined, year);

      return httpResponseHandler.sendSuccessResponse(
        res,
        200,
        'GET',
        'INCOME',
        result[0],
        'SPENDING',
        result[1],
      );
      // res.status(200).json({ INCOME: result[0], SPENDING: result[1] });
    } else if (rule === 'category' && unit === 'family') {
      if (!month) {
        error.throwErr(400, 'KEY_ERROR');
      }
      const result = await moneyFlowService.getChartDataByCategory(
        undefined,
        familyId,
        year,
        month,
      );

      res.status(200).json(result);
    } else if (rule === 'category' && unit === 'private') {
      if (!month) {
        error.throwErr(400, 'KEY_ERROR');
      }
      const result = await moneyFlowService.getChartDataByCategory(userId, undefined, year, month);

      res.status(200).json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message || 'INTERNAL_SERVER_ERROR' });
  }
};

const postMoneyFlow = async (req, res) => {
  try {
    const { userId } = req.userData;
    const { type, category, memo, amount, year, month, date } = req.body;
    if (!type || !category || !memo || !amount || !year || !month || !date) {
      error.throwErr(400, 'KEY_ERROR');
    }
    if (year <= 0 || month > 12 || month < 1 || amount < 0) {
      error.throwErr(409, '잘못된 접근입니다');
    }
    const categoryId = await categoryService.getIdByCategoryName(category);
    await moneyFlowService.postMoneyFlow(userId, type, categoryId, memo, amount, year, month, date);
    return httpResponseHandler.sendSuccessResponse(res, 200, 'POST');
  } catch (err) {
    console.error(err);
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || 'INTERNAL_SERVER_ERROR' });
  }
};

const getMoneyFlowsByCondition = async (req, res) => {
  try {
    const { userId, familyId } = req.userData;
    const { userName, year, month, date } = req.query;
    if (!year && (month || date)) {
      // 연도가 없고 월, 날짜 조건이 있는 경우  => 연도를 입력해 주세요
      error.throwErr(400, 'KEY_ERROR_SELECT_A_YEAR');
    } else if (!familyId) {
      return await MoneyFlowResponseHandler.sendGetSuccessResponse(userId, res, year, month, date);
    } else if (!userName) {
      const familyUsersIds = await usersFamilyService.getFamilyUsersIds(familyId);
      return await MoneyFlowResponseHandler.sendGetSuccessResponseByFamilyUserIds(
        res,
        familyUsersIds,
        year,
        month,
        date,
      );
    } else if (userName) {
      const userId = await usersFamilyService.getAuthenticUserId(familyId, userName);
      return await MoneyFlowResponseHandler.sendGetSuccessResponse(res, userId, year, month, date);
    }
  } catch (err) {
    console.error(err);
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || 'INTERNAL_SERVER_ERROR' });
  }
};

const updateMoneyFlow = async (req, res) => {
  try {
    const { userId } = req.userData;
    const { id, type, category, memo, amount, year, month, date } = req.body;
    if (!id || !type || !category || !memo || !amount || !year || !month || !date) {
      error.throwErr(400, 'KEY_ERROR');
    }
    const categoryId = await categoryService.getIdByCategoryName(category);
    await moneyFlowService.updateMoneyFlow(
      id,
      userId,
      type,
      categoryId,
      memo,
      amount,
      year,
      month,
      date,
    );
    return httpResponseHandler.sendSuccessResponse(res, 200, 'PUT');
  } catch (err) {
    console.error(err);
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || 'INTERNAL_SERVER_ERROR' });
  }
};

const deleteMoneyFlow = async (req, res) => {
  try {
    const { userId } = req.userData;
    const { id } = req.query;
    if (!id) {
      error.throwErr(400, 'KEY_ERROR');
    }
    await moneyFlowService.deleteMoneyFlow(id, userId);
    return httpResponseHandler.sendSuccessResponse(res, 200, 'DELETE');
  } catch (err) {
    console.error(err);
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || 'INTERNAL_SERVER_ERROR' });
  }
};

module.exports = {
  search,
  getChartDataOfMoneyFlows,
  postMoneyFlow,
  getMoneyFlowsByCondition,
  updateMoneyFlow,
  deleteMoneyFlow,
};
