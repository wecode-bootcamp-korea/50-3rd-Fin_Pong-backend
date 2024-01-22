const moneyFlowService = require('../services/moneyFlowService');
const categoryService = require('../services/categoryService');
const usersFamilyService = require('../services/usersFamilyService');
const error = require('../utils/error');
const ResponseHandler = require('../utils/http');

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

      res.status(200).json({ INCOME: result[0], SPENDING: result[1] });
    } else if (rule === 'year' && unit === 'private') {
      const result = await moneyFlowService.getChartDataByYear(userId, undefined, year);

      res.status(200).json({ INCOME: result[0], SPENDING: result[1] });
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
    return ResponseHandler.sendSuccessResponse(res, 200, 'POST');
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
      // 가족에 가입하지 않은 사용자가 본인의 수입/지출 내역을 조회합니다.
      if (!year && !month && !date) {
        // 연도, 월, 날짜의 조건이 없는 경우 => 해당 유저의 수입/지출내역을 모두 찾습니다.
        const moneyFlows = await moneyFlowService.getMoneyFlowsByUserId(userId);
        return ResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', moneyFlows);
      } else if (year && !month && !date) {
        // 연도 조건만 있고, 월, 날짜 조건은 없는 경우 => 해당 유저의 해당 연도의 모든 수입/지출 내역을 찾습니다.
        const moneyFlows = await moneyFlowService.getMoneyFlowsByUserIdByYear(userId, year);
        return ResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', moneyFlows);
      } else if (year && month && !date) {
        // 연도, 월 조건만 있고, 날짜 조건은 없는 경우
        const moneyFlows = await moneyFlowService.getMoneyFlowsByUserIdByYearMonth(
          userId,
          year,
          month,
        ); // 해당 유저의 해당 연, 월의 수입/지출 내역을 찾습니다.
        return ResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', moneyFlows);
      } else if (year && !month && date) {
        // 월 조건만 없고, 연, 날짜 조건만 있는 경우 (ex.2023년의 매달 1일에 무엇을 쓰고 벌었는 지 알려줘)
        const moneyFlows = await moneyFlowService.getMoneyFlowsByUserIdByYearDate(
          userId,
          year,
          date,
        ); // 해당 유저의 해당 연도의 해당 날짜의 수입/지출 내역들을 찾습니다.
        return ResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', moneyFlows);
      }

      const moneyFlows = await moneyFlowService.getMoneyFlowsByUserIdByYearMonthDate(
        userId,
        year,
        month,
        date,
      ); // 해당 유저의 해당 연, 월, 날짜의 수입/지출 내역을 찾습니다.
      return ResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', moneyFlows);
    } else if (!userName) {
      // 가족에 가입된 사용자가 가족 구성원 전체의 수입/지출 내역을 조회합니다.
      const familyUsersIds = await usersFamilyService.getFamilyUsersIds(familyId);
      if (!year && !month && !date) {
        // 연도, 월, 날짜의 조건이 없는 경우 => 가족 구성원 전체가 등록한 수입/지출 내역을 모두 찾습니다.
        const moneyFlows = await moneyFlowService.getMoneyFlowsByFamilyUserIds(familyUsersIds);
        return ResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', moneyFlows);
      } else if (year && !month && !date) {
        // 연도 조건만 있고, 월, 날짜 조건은 없는 경우 => 해당 연도에 발생한 가족 구성원 전체의 모든 수입/지출 내역을 찾습니다.
        const moneyFlows = await moneyFlowService.getMoneyFlowsByFamilyUserIdByYear(
          familyUsersIds,
          year,
        );
        return ResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', moneyFlows);
      } else if (year && month && !date) {
        // 연도, 월 조건만 있고, 날짜 조건은 없는 경우
        const moneyFlows = await moneyFlowService.getMoneyFlowsByFamilyUserIdByYearMonth(
          familyUsersIds,
          year,
          month,
        ); // 해당 연, 월에 발생한 가족 구성원 전체의 수입/지출 내역을 찾습니다.
        return ResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', moneyFlows);
      } else if (year && !month && date) {
        // 월 조건만 없고, 연, 날짜 조건만 있는 경우 (ex.2023년의 매달 1일에 무엇을 쓰고 벌었는 지 알려줘)
        const moneyFlows = await moneyFlowService.getMoneyFlowsByFamilyUserIdByYearDate(
          familyUsersIds,
          year,
          date,
        ); // 해당 연도, 해당 날짜에 발생한 가족 구성원 전체의 수입/지출 내역들을 찾습니다.
        return ResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', moneyFlows);
      }
      const moneyFlows = await moneyFlowService.getMoneyFlowsByFamilyUserIdsByYearMonthDate(
        familyUsersIds,
        year,
        month,
        date,
      ); // 해당 연, 월, 날짜에 발생한 가족 구성원 전체의 수입/지출 내역을 찾습니다.
      return ResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', moneyFlows);
    } else if (userName) {
      // 특정 가족 구성원의 수입/지출을 찾으려는 경우
      const userId = await usersFamilyService.getAuthenticUserId(familyId, userName); // familyId 정보와 유저의 이름으로 유저 id를 찾습니다.
      if (!year && !month && !date) {
        // 연도, 월, 날짜의 조건이 없는 경우 => 해당 유저의 수입/지출내역을 모두 찾습니다.
        const moneyFlows = await moneyFlowService.getMoneyFlowsByUserId(userId);
        return ResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', moneyFlows);
      } else if (year && !month && !date) {
        // 연도 조건만 있고, 월, 날짜 조건은 없는 경우 => 조회 대상 가족 구성원의 해당 연도의 모든 수입/지출 내역을 찾습니다.
        const moneyFlows = await moneyFlowService.getMoneyFlowsByUserIdByYear(userId, year);
        return ResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', moneyFlows);
      } else if (year && month && !date) {
        // 연도, 월 조건만 있고, 날짜 조건은 없는 경우
        const moneyFlows = await moneyFlowService.getMoneyFlowsByUserIdByYearMonth(
          userId,
          year,
          month,
        ); // 조회 대상 가족 구성원의 해당 연, 월의 수입/지출 내역을 찾습니다.
        return ResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', moneyFlows);
      } else if (year && !month && date) {
        // 월 조건만 없고, 연, 날짜 조건만 있는 경우 (ex.2023년의 매 1일에 등록된 모든 수입/지출 내역을 알려줘)
        const moneyFlows = await moneyFlowService.getMoneyFlowsByUserIdByYearDate(
          userId,
          year,
          date,
        ); // 조회 대상 가족 구성원의 해당 연도의 해당 날짜의 수입/지출 내역들을 찾습니다.
        return ResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', moneyFlows);
      }
      const moneyFlows = await moneyFlowService.getMoneyFlowsByUserIdByYearMonthDate(
        userId,
        year,
        month,
        date,
      ); // 조회 대상 가족 구성원의 해당 연, 월, 날짜의 수입/지출 내역을 찾습니다.
      return ResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', moneyFlows);
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
    return ResponseHandler.sendSuccessResponse(res, 200, 'PUT');
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
    return ResponseHandler.sendSuccessResponse(res, 200, 'DELETE');
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
