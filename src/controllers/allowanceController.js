const allowanceService = require('../services/allowanceService');
const usersFamilyService = require('../services/usersFamilyService');
const moneyFlowService = require('../services/moneyFlowService');
const error = require('../utils/error');
const { httpResponseHandler } = require('../utils/response');

const postAllowance = async (req, res) => {
  // 관리자만 가능
  try {
    const { familyId, roleId } = req.userData;
    if (!familyId || !roleId) {
      error.throwErr(400, 'NOT_INCLUDED_IN_FAMILY_OR_NOT_AN_ADMIN');
    }
    const { userName, allowance, year, month } = req.body;
    if (!userName || !allowance || !year || !month) {
      error.throwErr(400, 'KEY_ERROR');
    }
    if (allowance < 0 || year <= 0 || month > 12 || month < 1) {
      // 0원으로 입력하려는 접근은 허용합니다. 용돈이 0원이어도 서비스에 필요한 데이터를 주고 받을 수 있습니다
      error.throwErr(409, '잘못된 접근입니다');
    }
    const userId = await usersFamilyService.getAuthenticUserId(familyId, userName);
    await allowanceService.postAllowance(userId, allowance, year, month);
    return httpResponseHandler.sendSuccessResponse(res, 200, 'POST');
  } catch (err) {
    console.error(err);
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || 'INTERNAL_SERVER_ERROR' });
  }
};

const getAllowancesByCondition = async (req, res) => {
  // 일반 유저도 가능
  try {
    const { familyId } = req.userData;
    if (!familyId) {
      error.throwErr(400, 'NOT_INCLUDED_IN_FAMILY');
    }
    const familyUsersIds = await usersFamilyService.getFamilyUsersIds(familyId);
    const { year, month, userName } = req.query;
    if (year <= 0 || month > 12 || month < 1) {
      error.throwErr(409, '잘못된 접근입니다');
    } else if (!year && month) {
      // 달만 있고 연도가 없는 경우  => 연도를 입력해 주세요
      error.throwErr(400, 'KEY_ERROR_CHOOSE_YEAR');
    } else if (userName) {
      // 특정 유저의 용돈을 찾으려는 경우
      const userId = await usersFamilyService.getAuthenticUserId(familyId, userName); // familyId 정보와 유저의 이름으로 유저 id를 찾습니다.
      if (!year && !month) {
        // 연도, 월의 조건이 없는 경우 => 해당 유저의 용돈을 모두 찾습니다.
        const allowances = await allowanceService.getAllowancesByUserId(userId);
        return res.status(200).json({ message: 'GET_SUCCESS', allowances: allowances });
      } else if (year && !month) {
        // 연도 조건만 있고, 월 조건은 없는 경우 => 해당 유저의 해당 연도의 모든 용돈을 찾습니다..
        const allowances = await allowanceService.getAllowancesByUserIdByYear(userId, year);
        return res.status(200).json({ message: 'GET_SUCCESS', allowances: allowances });
      }
      const allowance = await allowanceService.getAllowanceByUserIdByYearMonth(userId, year, month); // 해당 유저의 해당 연, 월의 용돈을 찾습니다.
      return res.status(200).json({ message: 'GET_SUCCESS', allowances: allowance });
    } else {
      if (!year && !month) {
        // 연도, 월의 조건이 없는 경우 => 가족 구성원의 용돈을 모두 찾습니다. // 병합용 주석
        const allowances = await allowanceService.getAllowances(familyUsersIds);
        return res.status(200).json({ message: 'GET_SUCCESS', allowances: allowances });
      } else if (year && !month) {
        // 연도 조건만 있고, 월 조건은 없는 경우 => 가족 구성원의 해당 연도의 모든 용돈을 찾습니다.
        const allowances = await allowanceService.getAllowancesByYear(familyUsersIds, year);
        return res.status(200).json({ message: 'GET_SUCCESS', allowances: allowances });
      }
      const allowances = await allowanceService.getAllowanceByUserIdByYearMonth(
        familyUsersIds,
        year,
        month,
      ); // 가족 구성원의 해당 연, 월의 용돈을 찾습니다.
      return res.status(200).json({ message: 'GET_SUCCESS', allowances: allowances });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || 'INTERNAL_SERVER_ERROR' });
  }
};

const getRestAllowance = async (req, res) => {
  try {
    const { familyId } = req.userData;
    if (!familyId) {
      error.throwErr(400, 'NOT_INCLUDED_IN_FAMILY');
    }
    const { userName, year, month } = req.query;
    if (!userName || !year || !month) {
      error.throwErr(400, 'KEY_ERROR');
    }
    if (year <= 0 || month > 12 || month < 1) {
      error.throwErr(409, '잘못된 접근입니다');
    }
    const userId = await usersFamilyService.getAuthenticUserId(familyId, userName);
    const allowance = await allowanceService.getAllowanceSumByYearMonthByUserId(
      userId,
      year,
      month,
    ); // 해당 유저의 해당 연, 월의 용돈을 찾습니다.
    const sumOfUsage = await moneyFlowService.getUsedMoneySumFlowsByYearMonth(userId, year, month);
    const restAllowance = allowance - sumOfUsage;
    return res.status(200).json({ message: 'GET_SUCCESS', restAllowance: restAllowance });
  } catch (err) {
    console.error(err);
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || 'INTERNAL_SERVER_ERROR' });
  }
};

const updateAllowance = async (req, res) => {
  // 관리자만 가능
  try {
    const { familyId, roleId } = req.userData;
    if (!familyId || !roleId) {
      error.throwErr(400, 'NOT_INCLUDED_IN_FAMILY_OR_NOT_AN_ADMIN');
    }
    const { userName, allowance, year, month } = req.body;
    if (!userName || !allowance || !year || !month) {
      error.throwErr(400, 'KEY_ERROR');
    }
    if (allowance < 0 || year <= 0 || month > 12 || month < 1) {
      error.throwErr(409, '잘못된 접근입니다');
    }
    const userId = await usersFamilyService.getAuthenticUserId(familyId, userName); // 삭제 대상 userName을 가진 users.id입니다
    await allowanceService.updateAllowance(userId, allowance, year, month);
    return res.status(200).json({ message: 'PUT_SUCCESS' });
  } catch (err) {
    console.error(err);
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || 'INTERNAL_SERVER_ERROR' });
  }
};

const deleteAllowance = async (req, res) => {
  // 관리자만 가능
  try {
    const { familyId, roleId } = req.userData;
    if (!familyId || !roleId) {
      error.throwErr(400, 'NOT_INCLUDED_IN_FAMILY_OR_NOT_AN_ADMIN');
    }
    const { userName, year, month } = req.query;
    if (!userName || !year || !month) {
      error.throwErr(400, 'KEY_ERROR');
    }
    if (year <= 0 || month > 12 || month < 1) {
      error.throwErr(409, '잘못된 접근입니다.');
    }
    const userId = await usersFamilyService.getAuthenticUserId(familyId, userName);
    await allowanceService.deleteAllowance(userId, year, month);
    return res.status(200).json({ message: 'DELETE_SUCCESS' });
  } catch (err) {
    console.error(err);
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || 'INTERNAL_SERVER_ERROR' });
  }
};

module.exports = {
  postAllowance,
  getAllowancesByCondition,
  getRestAllowance,
  updateAllowance,
  deleteAllowance,
};
