const userService = require('../services/userService');
const flowTypeService = require('../services/flowTypeService');
const categoryService = require('../services/categoryService');

/**
 * Class for handling operations related to money flows.
 */
class MoneyFlowHandler {
  /**
   * Maps money flows for frontend representation.
   * @async
   * @function
   * @param {Object[]} flows - map()을 적용할, 복수의 object를 담은 배열입니다.
   * @returns {Promise<Object[]>} money flow objects를 맵핑한 배열입니다.
   * @throws {Error} Throws an error if any of the asynchronous operations fail.
   */
  static async mapMoneyFlows(flows) {
    return await Promise.all(
      flows.map(async (flow) => ({
        id: flow.id,
        userName: await userService.getNameById(flow['user_id']),
        flowType: await flowTypeService.getFlowStatusById(flow['flow_type_id']),
        category: await categoryService.getNameById(flow['category_id']),
        memo: flow.memo,
        amount: flow.amount,
        year: flow.year,
        month: flow.month,
        date: flow.date,
      })),
    );
  }
}

/**
 * Class for handling operations related to category sets.
 */
class CategorySetHandler {
  /**
   * 두 배열을 카테고리별로 합산된 배열 object로 변환합니다.
   * @async
   * @function
   * @param {Object[]} array1 - 첫 번째 배열입니다.
   * @param {Object[]} array2 - 두 번째 배열입니다.
   * @returns {Promise<Object[][]>} 카테고리별로 합산된 배열 집합을 반환합니다.
   */
  static async changeArraysIntoCategorySetArray(array1, array2) {
    const changeArraysResult = [array1, array2].map((resultArray) => {
      const sumOfFlowObject = {};

      for (const element of resultArray) {
        const { category, spending } = element;

        if (sumOfFlowObject[category]) {
          sumOfFlowObject[category] += Number(spending);
        } else {
          sumOfFlowObject[category] = Number(spending);
        }
      }

      return Object.entries(sumOfFlowObject).map(([category, spending]) => ({
        category,
        spending,
      }));
    });

    return changeArraysResult;
  }
}

/**
 * Class for handling operations related to concatenated money flows arrays.
 */
class ConcatenatedMoneyFlowsHandler {
  /**
   * Concatenates mapped money flows arrays for multiple users.
   * @async
   * @function
   * @param {string[]} userIds - 복수의 userId를 담은 배열입니다.
   * @param {function} getMultipleUsersMoneyFlowsFn - The function to retrieve money flows for a user.
   * @param {...*} params - getMultipleUsersMoneyFlowsFn를 위한 추가 매개 변수.
   * @returns {Promise<Object[]>} The concatenated array of mapped money flow objects.
   * @throws {Error} Throws an error if any of the asynchronous operations fail.
   */
  static async concatMoneyFlowsArrays(userIds, getMultipleUsersMoneyFlowsFn, ...params) {
    let usersMoneyFlows = [];
    for (const userId of userIds) {
      const flows = await getMultipleUsersMoneyFlowsFn(userId, ...params);
      usersMoneyFlows = usersMoneyFlows.concat(await MoneyFlowHandler.mapMoneyFlows(flows));
    }
    return usersMoneyFlows;
  }
}

module.exports = {
  MoneyFlowHandler,
  CategorySetHandler,
  ConcatenatedMoneyFlowsHandler,
};
