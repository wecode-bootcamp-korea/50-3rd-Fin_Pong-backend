const moneyFlowService = require('../services/moneyFlowService');
const usersFamilyService = require('../services/usersFamilyService');

/**
 * HTTP 응답을 처리하는 유틸리티 클래스입니다.
 * @class
 */
class httpResponseHandler {
  /**
   * 성공 응답을 전송합니다.
   * @static
   * @param {Object} res - Express 응답 객체입니다.
   * @param {number} statusCode - HTTP 상태 코드입니다.
   * @param {string} method - 성공 메시지에 사용될 메서드 이름입니다.
   * @param {...*} params - 추가적인 매개 변수로 key-value 쌍을 받습니다..
   * @returns {Object} Express 응답 객체입니다.
   */
  static sendSuccessResponse(res, statusCode, method, ...params) {
    const responseData = { message: `${method}_SUCCESS` };

    if (params.length === 0) {
      return res.status(statusCode).json(responseData);
    }

    // key-value 쌍으로 가정하여 순회
    for (let i = 0; i < params.length; i += 2) {
      const key = params[i];
      responseData[key] = params[i + 1]; // 해당 key의 value입니다.
    }

    return res.status(statusCode).json(responseData);
  }
}

/**
 * @classdesc 자금 흐름 응답을 처리하는 핸들러 클래스입니다.
 */
class MoneyFlowResponseHandler {
  /**
   * 사용자 아이디에 따른 성공 응답을 보냅니다.
   * @static
   * @param {Object} res - Express 응답 객체입니다.
   * @param {string} userId - 사용자 아이디입니다.
   * @param {string} year - 연도입니다.
   * @param {string} month - 월입니다.
   * @param {string} date - 날짜입니다.
   * @returns {Promise<Object>} Express 응답 객체입니다.
   */
  static async sendGetSuccessResponse(res, userId, year, month, date) {
    if (!year && !month && !date) {
      return this.sendSuccessResponseByUserId(userId, res);
    } else if (year && !month && !date) {
      return this.sendSuccessResponseByUserIdByYear(userId, year, res);
    } else if (year && month && !date) {
      return this.sendSuccessResponseByUserIdByYearMonth(userId, year, month, res);
    } else if (year && !month && date) {
      return this.sendSuccessResponseByUserIdByYearDate(userId, year, date, res);
    } else {
      return this.sendSuccessResponseByUserIdByYearMonthDate(userId, year, month, date, res);
    }
  }

  /**
   * 사용자 아이디에 따른 성공 응답을 보내는데, 사용자 이름이 주어진 경우 사용합니다.
   * @static
   * @param {string} userId - 사용자 아이디입니다.
   * @param {Object} res - Express 응답 객체입니다.
   * @param {string} userName - 사용자 이름입니다.
   * @param {string} familyId - 가족 아이디입니다.
   * @returns {Promise<Object>} Express 응답 객체입니다.
   */
  static async sendGetSuccessResponseByUserId(userId, res, userName, familyId) {
    if (userName) {
      const userId = await usersFamilyService.getAuthenticUserId(familyId, userName);
      return this.sendSuccessResponseByUserId(userId, res);
    } else {
      return this.sendSuccessResponseByUserId(userId, res);
    }
  }

  /**
   * 사용자 아이디에 따른 성공 응답을 보냅니다. 사용자 이름이 없는 경우 기본 아이디를 사용합니다.
   * @static
   * @param {string} userId - 사용자 아이디입니다.
   * @param {Object} res - Express 응답 객체입니다.
   * @returns {Promise<Object>} Express 응답 객체입니다.
   */
  static async sendSuccessResponseByUserId(userId, res) {
    const moneyFlows = await moneyFlowService.getMoneyFlowsByUserId(userId);
    return httpResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', moneyFlows);
  }

  /**
   * 사용자 아이디와 연도에 따른 성공 응답을 보냅니다.
   * @static
   * @param {string} userId - 사용자 아이디입니다.
   * @param {string} year - 연도입니다.
   * @param {Object} res - Express 응답 객체입니다.
   * @returns {Promise<Object>} Express 응답 객체입니다.
   */
  static async sendSuccessResponseByUserIdByYear(userId, year, res) {
    const moneyFlows = await moneyFlowService.getMoneyFlowsByUserIdByYear(userId, year);
    return httpResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', moneyFlows);
  }

  /**
   * 사용자 아이디와 연도, 월에 따른 성공 응답을 보냅니다.
   * @static
   * @param {string} userId - 사용자 아이디입니다.
   * @param {string} year - 연도입니다.
   * @param {string} month - 월입니다.
   * @param {Object} res - Express 응답 객체입니다.
   * @returns {Promise<Object>} Express 응답 객체입니다.
   */
  static async sendSuccessResponseByUserIdByYearMonth(userId, year, month, res) {
    const moneyFlows = await moneyFlowService.getMoneyFlowsByUserIdByYearMonth(userId, year, month);
    return httpResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', moneyFlows);
  }

  /**
   * 사용자 아이디와 연도, 날짜에 따른 성공 응답을 보냅니다.
   * @static
   * @param {string} userId - 사용자 아이디입니다.
   * @param {string} year - 연도입니다.
   * @param {string} date - 날짜입니다.
   * @param {Object} res - Express 응답 객체입니다.
   * @returns {Promise<Object>} Express 응답 객체입니다.
   */
  static async sendSuccessResponseByUserIdByYearDate(userId, year, date, res) {
    const moneyFlows = await moneyFlowService.getMoneyFlowsByUserIdByYearDate(userId, year, date);
    return httpResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', moneyFlows);
  }

  /**
   * 사용자 아이디와 연도, 월, 날짜에 따른 성공 응답을 보냅니다.
   * @static
   * @param {string} userId - 사용자 아이디입니다.
   * @param {string} year - 연도입니다.
   * @param {string} month - 월입니다.
   * @param {string} date - 날짜입니다.
   * @param {Object} res - Express 응답 객체입니다.
   * @returns {Promise<Object>} Express 응답 객체입니다.
   */
  static async sendSuccessResponseByUserIdByYearMonthDate(userId, year, month, date, res) {
    const moneyFlows = await moneyFlowService.getMoneyFlowsByUserIdByYearMonthDate(
      userId,
      year,
      month,
      date,
    );
    return httpResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', moneyFlows);
  }

  /**
   * 가족 사용자의 아이디에 따른 성공 응답을 보냅니다. 적어도 한 명 이상입니다.
   * @static
   * @param {Object} res - Express 응답 객체입니다.
   * @param {Array<string>} familyUsersIds - 가족 사용자 아이디들입니다.
   * @param {string} year - 연도입니다.
   * @param {string} month - 월입니다.
   * @param {string} date - 날짜입니다.
   * @returns {Promise<Object>} Express 응답 객체입니다.
   */
  static async sendGetSuccessResponseByFamilyUserIds(res, familyUsersIds, year, month, date) {
    if (!year && !month && !date) {
      return this.sendSuccessResponseByFamilyUserIds(familyUsersIds, res);
    } else if (year && !month && !date) {
      return this.sendSuccessResponseByFamilyUserIdByYear(familyUsersIds, year, res);
    } else if (year && month && !date) {
      return this.sendSuccessResponseByFamilyUserIdByYearMonth(familyUsersIds, year, month, res);
    } else if (year && !month && date) {
      return this.sendSuccessResponseByFamilyUserIdByYearDate(familyUsersIds, year, date, res);
    } else {
      return this.sendSuccessResponseByFamilyUserIdsByYearMonthDate(
        familyUsersIds,
        year,
        month,
        date,
        res,
      );
    }
  }

  /**
   * 가족 사용자 아이디에 따른 성공 응답을 보냅니다.
   * @static
   * @param {Array<string>} familyUsersIds - 가족 사용자 아이디들입니다.
   * @param {Object} res - Express 응답 객체입니다.
   * @returns {Promise<Object>} Express 응답 객체입니다.
   */
  static async sendSuccessResponseByFamilyUserIds(familyUsersIds, res) {
    const moneyFlows = await moneyFlowService.getMoneyFlowsByFamilyUserIds(familyUsersIds);
    return httpResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', moneyFlows);
  }

  /**
   * 가족 사용자 아이디와 연도에 따른 성공 응답을 보냅니다.
   * @static
   * @param {Array<string>} familyUsersIds - 가족 사용자 아이디들입니다.
   * @param {string} year - 연도입니다.
   * @param {Object} res - Express 응답 객체입니다.
   * @returns {Promise<Object>} Express 응답 객체입니다.
   */
  static async sendSuccessResponseByFamilyUserIdByYear(familyUsersIds, year, res) {
    const moneyFlows = await moneyFlowService.getMoneyFlowsByFamilyUserIdByYear(
      familyUsersIds,
      year,
    );
    return httpResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', moneyFlows);
  }

  /**
   * 가족 사용자 아이디와 연도, 월에 따른 성공 응답을 보냅니다.
   * @static
   * @param {Array<string>} familyUsersIds - 가족 사용자 아이디들입니다.
   * @param {string} year - 연도입니다.
   * @param {string} month - 월입니다.
   * @param {Object} res - Express 응답 객체입니다.
   * @returns {Promise<Object>} Express 응답 객체입니다.
   */
  static async sendSuccessResponseByFamilyUserIdByYearMonth(familyUsersIds, year, month, res) {
    const moneyFlows = await moneyFlowService.getMoneyFlowsByFamilyUserIdByYearMonth(
      familyUsersIds,
      year,
      month,
    );
    return httpResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', moneyFlows);
  }

  /**
   * 가족 사용자 아이디와 연도, 날짜에 따른 성공 응답을 보냅니다.
   * @static
   * @param {Array<string>} familyUsersIds - 가족 사용자 아이디들입니다.
   * @param {string} year - 연도입니다.
   * @param {string} date - 날짜입니다.
   * @param {Object} res - Express 응답 객체입니다.
   * @returns {Promise<Object>} Express 응답 객체입니다.
   */
  static async sendSuccessResponseByFamilyUserIdByYearDate(familyUsersIds, year, date, res) {
    const moneyFlows = await moneyFlowService.getMoneyFlowsByFamilyUserIdByYearDate(
      familyUsersIds,
      year,
      date,
    );
    return httpResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', moneyFlows);
  }

  /**
   * 가족 사용자 아이디와 연도, 월, 날짜에 따른 성공 응답을 보냅니다.
   * @static
   * @param {Array<string>} familyUsersIds - 가족 사용자 아이디들입니다.
   * @param {string} year - 연도입니다.
   * @param {string} month - 월입니다.
   * @param {string} date - 날짜입니다.
   * @param {Object} res - Express 응답 객체입니다.
   * @returns {Promise<Object>} Express 응답 객체입니다.
   */
  static async sendSuccessResponseByFamilyUserIdsByYearMonthDate(
    familyUsersIds,
    year,
    month,
    date,
    res,
  ) {
    const moneyFlows = await moneyFlowService.getMoneyFlowsByFamilyUserIdsByYearMonthDate(
      familyUsersIds,
      year,
      month,
      date,
    );
    return httpResponseHandler.sendSuccessResponse(res, 200, 'GET', 'flows', moneyFlows);
  }
}

module.exports = {
  httpResponseHandler,
  MoneyFlowResponseHandler,
};
