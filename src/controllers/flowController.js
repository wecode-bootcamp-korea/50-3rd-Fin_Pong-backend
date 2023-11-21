const flowServices = require('../services/flowService')

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
    const result = await flowServices.search( data )
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
      const result = await flowServices.yearlyView( userId, familyId, year )
      res.status(200).json({'INCOME' : result[0], 'SPENDING' : result[1]})
    }else if(rule === 'year' && unit === 'private'){
      const familyId = undefined
      const result = await flowServices.yearlyView( userId, familyId, year )
      res.status(200).json({'INCOME' : result[0], 'SPENDING' : result[1]})
    }else if(rule === 'category' && unit === 'family'){
      if(!month){
        const err = new Error('KEY_ERROR')
        err.status = 400
        throw err
      }
      const userId = undefined
      const result = await flowServices.categoryView( userId, familyId, year, month )
      res.status(200).json(result)
    }else if(rule === 'category' && unit === 'private'){
      if(!month){
        const err = new Error('KEY_ERROR')
        err.status = 400
        throw err
      }
      const familyId = undefined
      const result = await flowServices.categoryView( userId, familyId, year, month )
      res.status(200).json(result)
    }
  }catch(err){
    console.log(err)
    res.status(err.status || 500).json({message : err.message})
  }
}

module.exports = {
  search,
  view,
}