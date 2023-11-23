const moneyFlowService = require('../services/moneyFlowService');
const categoryService = require('../services/categoryService');
const usersFamilyService = require('../services/usersFamilyService');
const error = require('../utils/error');

const search = async(req,res) => {
  try{
    const familyId = req.userData.familyId
    if(!req.query.year || !req.query.month ){
      const err = new Error('KEY_ERROR')
      err.status = 400
      throw err
    }
    const data = {
      year          : Number(req.query.year),
      month         : Number(req.query.month),
      dateOrder     : req.query.date_order              || 'DESC',
      choiceUserId  : Number(req.query.choice_user_id),
      categoryId    : Number(req.query.category_id),
      flowTypeId    : Number(req.query.flow_type_id),
      memo          : req.query.memo,
      userId        : Number(req.query.choice_user_id),
      familyId      : Number(familyId)
    }
    const result = await moneyFlowService.search( data )
    res.status(200).json(result)
  }catch(err){
    console.log(err)
    res.status(err.status || 500).json({message : err.message})
  }
}

const view = async(req, res) => {
  try{
    const familyId = req.userData.familyId
    const userId = req.userData.userId
    if(!req.query.rule || !req.query.year || !req.query.unit){
      const err = new Error('KEY_ERROR')
      err.status = 400
      throw err
    }
    const {
      year  : year,
      month : month = '',
      rule  : rule,
      unit  : unit
    } = req.query

    if (rule === 'year' && unit === 'family'){
      const userId = undefined
      const result = await moneyFlowService.yearlyView( userId, familyId, year )
      res.status(200).json({'INCOME' : result[0], 'SPENDING' : result[1]})
    }else if(rule === 'year' && unit === 'private'){
      const familyId = undefined
      const result = await moneyFlowService.yearlyView( userId, familyId, year )
      res.status(200).json({'INCOME' : result[0], 'SPENDING' : result[1]})
    }else if(rule === 'category' && unit === 'family'){
      if(!month){
        const err = new Error('KEY_ERROR')
        err.status = 400
        throw err
      }
      const userId = undefined
      const result = await moneyFlowService.categoryView( userId, familyId, year, month )
      res.status(200).json(result)
    }else if(rule === 'category' && unit === 'private'){
      if(!month){
        const err = new Error('KEY_ERROR')
        err.status = 400
        throw err
      }
      const familyId = undefined
      const result = await moneyFlowService.categoryView( userId, familyId, year, month )
      res.status(200).json(result)
    }
  }catch(err){
    console.log(err)
    res.status(err.status || 500).json({message : err.message})
  }
}


const postMoneyFlow = async (req, res) => {
  try {
    const { userId } = req.userData;
    const { type, category, memo, amount, year, month, date } = req.body;
    if (!type || !category || !memo || !amount || !year || !month || !date) {
      error.throwErr(400, 'KEY_ERROR');
    }
    const categoryId = await categoryService.getIdByCategoryName(category);
    await moneyFlowService.postMoneyFlow(userId, type, categoryId, memo, amount, year, month, date);
    return res.status(200).json({message: 'POST_SUCCESS'})
  } catch (err) {
    console.error(err);
    return res.status(err.statusCode || 500).json({message: err.message || 'INTERNAL_SERVER_ERROR'});
  }
}

getMoneyFlowsByCondition = async (req, res) => {
  try {
    const { familyId } = req.userData;
    const { userName, year, month, date } = req.query;
    if (!year && (month || date)) { // 연도가 없고 월, 날짜 조건이 있는 경우  => 연도를 입력해 주세요
      error.throwErr(400, 'KEY_ERROR_SELECT_A_YEAR');
    }
    else if (userName) { // 특정 유저의 수입/지출을 찾으려는 경우
      const userId = await usersFamilyService.getAuthenticUserId(familyId, userName); // familyId 정보와 유저의 이름으로 유저 id를 찾습니다.
      if (!year && !month && !date) { // 연도, 월, 날짜의 조건이 없는 경우 => 해당 유저의 수입/지출내역을 모두 찾습니다.
        const moneyFlows = await moneyFlowService.getMoneyFlowsByUserId(userId);
        return res.status(200).json({message: 'GET_SUCCESS', flows: moneyFlows});
      }
      else if (year && !month && !date) { // 연도 조건만 있고, 월, 날짜 조건은 없는 경우 => 해당 유저의 해당 연도의 모든 수입/지출 내역을 찾습니다.
        const moneyFlows = await moneyFlowService.getMoneyFlowsByUserIdByYear(userId, year);
        return res.status(200).json({message: 'GET_SUCCESS', flows: moneyFlows});
      }
      else if (year && month && !date) { // 연도, 월 조건만 있고, 날짜 조건은 없는 경우
        const moneyFlows = await moneyFlowService.getMoneyFlowsByUserIdByYearMonth(userId, year, month); // 해당 유저의 해당 연, 월의 수입/지출 내역을 찾습니다.
        return res.status(200).json({message: 'GET_SUCCESS', flows: moneyFlows});
      }
      else if (year && !month && date) { // 월 조건만 없고, 연, 날짜 조건만 있는 경우 (ex.2023년의 매달 1일에 무엇을 쓰고 벌었는 지 알려줘)
        const moneyFlows = await moneyFlowService.getMoneyFlowsByUserIdByYearDate(userId, year, date); // 해당 유저의 해당 연도의 해당 날짜의 수입/지출 내역들을 찾습니다.
        return res.status(200).json({message: 'GET_SUCCESS', flows: moneyFlows});
      }
      const moneyFlows = await moneyFlowService.getMoneyFlowsByUserIdByYearMonthDate(userId, year, month, date); // 해당 유저의 해당 연, 월, 날짜의 수입/지출 내역을 찾습니다.
      return res.status(200).json({message: 'GET_SUCCESS', flows: moneyFlows});
    }
    else if (!userName) {
      const familyUsersIds = await usersFamilyService.getFamilyUsersIds(familyId);
      if (!year && !month && !date) { // 연도, 월, 날짜의 조건이 없는 경우 => 해당 유저의 수입/지출내역을 모두 찾습니다.
        const moneyFlows = await moneyFlowService.getMoneyFlowsByFamilyUserId(familyUsersIds);
        return res.status(200).json({message: 'GET_SUCCESS', flows: moneyFlows});
      }
      else if (year && !month && !date) { // 연도 조건만 있고, 월, 날짜 조건은 없는 경우 => 가족 구성원의 해당 연도의 모든 수입/지출 내역을 찾습니다.
        const moneyFlows = await moneyFlowService.getMoneyFlowsByFamilyUserIdByYear(familyUsersIds, year);
        return res.status(200).json({message: 'GET_SUCCESS', flows: moneyFlows});
      }
      else if (year && month && !date) { // 연도, 월 조건만 있고, 날짜 조건은 없는 경우
        const moneyFlows = await moneyFlowService.getMoneyFlowsByFamilyUserIdByYearMonth(familyUsersIds, year, month); // 해당 유저의 해당 연, 월의 수입/지출 내역을 찾습니다.
        return res.status(200).json({message: 'GET_SUCCESS', flows: moneyFlows});
      }
      else if (year && !month && date) { // 월 조건만 없고, 연, 날짜 조건만 있는 경우 (ex.2023년의 매달 1일에 무엇을 쓰고 벌었는 지 알려줘)
        const moneyFlows = await moneyFlowService.getMoneyFlowsByFamilyUserIdByYearDate(familyUsersIds, year, date); // 해당 유저의 해당 연도의 해당 날짜의 수입/지출 내역들을 찾습니다.
        return res.status(200).json({message: 'GET_SUCCESS', flows: moneyFlows});
      }
      const moneyFlows = await moneyFlowService.getMoneyFlowsByFamilyUserIdByYearMonthDate(familyUsersIds, year, month, date); // 가족 구성원의 해당 연, 월, 날짜의 수입/지출 내역을 찾습니다.
      return res.status(200).json({message: 'GET_SUCCESS', flows: moneyFlows});
    }
  } catch (err) {
    console.error(err);
    return res.status(err.statusCode || 500).json({message: err.message || 'INTERNAL_SERVER_ERROR'});
  }
}

const updateMoneyFlow = async (req, res) => {
  try {
    const { userId } = req.userData;
    const { id, type, category, memo, amount, year, month, date } = req.body;
    if (!id || !type || !category || !memo || !amount || !year || !month || !date) {
      error.throwErr(400, 'KEY_ERROR');
    }
    const categoryId = await categoryService.getIdByCategoryName(category);
    await moneyFlowService.updateMoneyFlow(id, userId, type, categoryId, memo, amount, year, month, date);
    return res.status(200).json({message: 'PUT_SUCCESS'})
  } catch (err) {
    console.error(err);
    return res.status(err.statusCode || 500).json({message: err.message || 'INTERNAL_SERVER_ERROR'});
  }
}

const deleteMoneyFlow = async (req, res) => {
  try{
    const { userId } = req.userData;
    const { id } = req.query;
    if (!id) {
      error.throwErr(400, 'KEY_ERROR');
    }
    await moneyFlowService.deleteMoneyFlow(id, userId);
    return res.status(200).json({message: 'DELETE_SUCCESS'});
  } catch (err) {
    console.error(err);
    return res.status(err.statusCode || 500).json({message: err.message || 'INTERNAL_SERVER_ERROR'});
  }
}

module.exports = {
  search,
  view,
  postMoneyFlow,
  getMoneyFlowsByCondition,
  updateMoneyFlow,
  deleteMoneyFlow
}