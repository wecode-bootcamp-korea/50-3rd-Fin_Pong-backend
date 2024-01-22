/**
 * HTTP 응답을 처리하는 유틸리티 클래스입니다.
 * @class
 */
class ResponseHandler {
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
    if (params.length === 0) {
      return res.status(statusCode).json({ message: `${method}_SUCCESS` });
    }

    const responseData = { message: `${method}_SUCCESS` };

    // key-value 쌍으로 가정하여 순회
    for (let i = 0; i < params.length; i += 2) {
      const key = params[i];
      const value = params[i + 1];
      responseData[key] = value;
    }

    return res.status(statusCode).json(responseData);
  }
}

module.exports = ResponseHandler;
