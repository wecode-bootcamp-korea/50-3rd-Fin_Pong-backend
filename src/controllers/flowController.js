const flowServices = require('../services/flowService')

const search = async(req,res) => {
  try{
    const data = {
      year = year,
      month = month,
      date = date,
      user_id = user_id,
      category_id = category_id,
      flow_type_id = flow_type_id,
      memo = memo
    } = req.query
    console.log(data)
    // const result = await flowServices.search()
  }catch(err){
    console.log(err)
    res.status(err.statusCode || 500).json({message : err.message})
  }
}

const view = async(req, res) => {
  try{
    const {
      year  : year,
      month : month = '',
      rule  : rule,
      unit  : unit
    } = req.query
    const familyId = 1
    const userId = 1

    if (rule === 'year' && unit === 'family'){
      const userId = 0
      const result = await flowServices.yearlyView( userId, familyId, year )
      res.status(200).json(result)
    }else if(rule === 'year' && unit === 'private'){
      const familyId = 0
      const result = await flowServices.yearlyView( userId, familyId, year )
      res.status(200).json(result)
    }else if(rule === 'category' && unit === 'family'){
      const userId = 0
      const result = await flowServices.categoryView( userId, familyId, year, month )
      res.status(200).json(result)
    }else if(rule === 'category' && unit === 'private'){
      const familyId = 0
      const result = await flowServices.categoryView( userId, familyId, year, month )
      res.status(200).json(result)
    }else{
      const err = new Error('KEY_ERROR')
      err.status = 400
      throw error
    }
  }catch(err){
    console.log(err)
    res.status(err.statusCode || 500).json({message : err.message})
  }
}

module.exports = {
  search,
  view,
}