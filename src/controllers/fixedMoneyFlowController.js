const fixedMoneyFlowService = require('../services/fixedMoneyFlowService');
const categoryService = require('../services/categoryService');
const error = require('../utils/error');
const { httpResponseHandler } = require('../utils/response');

const postFixedFlows = async (req, res) => {
  // 관리자만 가능
  try {
    const { userId, familyId, roleId } = req.userData;
    if (!familyId || !roleId) {
      error.throwErr(400, 'NOT_AN_ADMIN');
    }
    const { type, category, memo, amount, startYear, startMonth, startDate, endYear, endMonth } =
      req.body;
    if (
      !type ||
      !category ||
      !memo ||
      !amount ||
      !startYear ||
      !startMonth ||
      !startDate ||
      !endYear ||
      !endMonth
    ) {
      error.throwErr(400, 'KEY_ERROR');
    }
    const categoryId = await categoryService.getIdByCategoryName(category);
    await fixedMoneyFlowService.postFixedMoneyFlows(
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
    );
    return httpResponseHandler.sendSuccessResponse(res, 200, 'POST');
  } catch (err) {
    console.error(err);
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || 'INTERNAL_SERVER_ERROR' });
  }
};

const getFixedMoneyFlowsByCondition = async (req, res) => {
  try {
    const { userId, familyId, roleId } = req.userData;
    if (!familyId || !roleId) {
      error.throwErr(400, 'NOT_AN_ADMIN');
    }
    const { month, year, date } = req.query;
    if (!year && (month || date)) {
      // 연도가 없고 월, 날짜 조건이 있는 경우  => 연도를 입력해 주세요
      error.throwErr(400, 'KEY_ERROR_SELECT_A_YEAR');
    } else if (!year && !month && !date) {
      // 연도, 월, 날짜의 조건이 없는 경우 => 해당 가족의 고정 수입/지출내역을 모두 찾습니다.
      const fixedMoneyFlows = await fixedMoneyFlowService.getFixedMoneyFlows(userId);
      return httpResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', fixedMoneyFlows);
    } else if (year && month && !date) {
      // 연도, 월 조건만 있고, 날짜 조건은 없는 경우
      const fixedMoneyFlows = await fixedMoneyFlowService.getFixedMoneyFlowsByYearMonth(
        userId,
        year,
        month,
      ); // 해당 연, 월의 고정 수입/지출 내역을 찾습니다.
      return httpResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', fixedMoneyFlows);
    } else if (year && !month && date) {
      // 월 조건만 없고, 연, 날짜 조건만 있는 경우 (ex.2023년의 매달 1일에 무엇을 쓰고 벌었는 지 알려줘)
      const fixedMoneyFlows = await fixedMoneyFlowService.getFixedMoneyFlowsByYearDate(
        userId,
        year,
        date,
      ); // 해당 연도의 해당 날짜의 고정 수입/지출 내역들을 찾습니다.
      return httpResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', fixedMoneyFlows);
    }
    const fixedMoneyFlows = await fixedMoneyFlowService.getFixedMoneyFlowsByYearMonthDate(
      userId,
      year,
      month,
      date,
    ); // 해당 유저의 해당 연, 월, 날짜의 수입/지출 내역을 찾습니다.
    return httpResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', fixedMoneyFlows);
  } catch (err) {
    console.error(err);
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || 'INTERNAL_SERVER_ERROR' });
  }
};

const updateFixedMoneyFlows = async (req, res) => {
  try {
    const { familyId, roleId } = req.userData;
    if (!familyId || !roleId) {
      error.throwErr(400, 'NOT_AN_ADMIN');
    }
    const { id, amount, type, category, memo } = req.body;
    if (!id || !amount || !type || !category || !memo) {
      error.throwErr(400, 'KEY_ERROR');
    }
    const groupId = await fixedMoneyFlowService.getGroupIdByFlowId(id);
    const updateTargetFixedMoneyFlowsIds = await fixedMoneyFlowService.getFlowIdsByGroupId(groupId);
    await fixedMoneyFlowService.updateFixedMoneyFlows(
      updateTargetFixedMoneyFlowsIds,
      amount,
      type,
      category,
      memo,
    );
    return httpResponseHandler.sendSuccessResponse(res, 200, 'PUT');
  } catch (err) {
    console.error(err);
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || 'INTERNAL_SERVER_ERROR' });
  }
};

const deleteFixedMoneyFlows = async (req, res) => {
  try {
    const { familyId, roleId } = req.userData;
    if (!familyId || !roleId) {
      error.throwErr(400, 'NOT_AN_ADMIN');
    }
    const { id, year, month, date } = req.query;
    if (!id || !year || !month || !date) {
      error.throwErr(400, 'KEY_ERROR');
    }
    const groupId = await fixedMoneyFlowService.getGroupIdByFlowId(id);
    const fixedFlowIds = await fixedMoneyFlowService.getFlowIdsByGroupId(groupId);
    await fixedMoneyFlowService.deleteFixedMoneyFlows(fixedFlowIds, groupId, year, month, date);
    return httpResponseHandler.sendSuccessResponse(res, 200, 'DELETE');
  } catch (err) {
    console.error(err);
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || 'INTERNAL_SERVER_ERROR' });
  }
};

module.exports = {
  postFixedFlows,
  getFixedMoneyFlowsByCondition,
  updateFixedMoneyFlows,
  deleteFixedMoneyFlows,
};
