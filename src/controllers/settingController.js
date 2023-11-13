const settingServices = require('../services/settingService')

const viewMonthFamily = async(req, res) => {
  try{
    const year = new Date().getFullYear()
    const familyId = 1
    const result =  await settingServices.viewMonthFamily( familyId, year )
    res.status(200).json( result )
  }catch(err){
    console.log(err)
    res.status(err.statusCode || 500).json({message : err.message})
  }
}

const viewMonthPrivate = async(req, res) => {
  try{
    const year = new Date().getFullYear()
    const userId = 1
    const result =  await settingServices.viewMonthPrivate( userId, year )
    res.json(result)
  }catch(err){
    console.log(err)
    res.status(err.statusCode || 500).json({message : err.message})
  }
}

const viewCategoryFamily = async(req, res) => {
  try{
    const year = new Date().getFullYear()
    const month = new Date().getMonth()+1
    const date = year + '-' + month
    const familyId = 1
    const result =  await settingServices.viewCategoryFamily( familyId, date )
    res.json(result)
  }catch(err){
    console.log(err)
    res.status(err.statusCode || 500).json({message : err.message})
  }  
}

const viewCategoryPrivate = async(req, res) => {
  try{
    const year = new Date().getFullYear()
    const month = new Date().getMonth()+1
    const date = year + '-' + month
    const userId = 1
    const result =  await settingServices.viewCategoryPrivate( userId, date )
    res.json(result)
  }catch(err){
    console.log(err)
    res.status(err.statusCode || 500).json({message : err.message})
  }  
}

module.exports = {
  viewMonthFamily,
  viewMonthPrivate,
  viewCategoryFamily,
  viewCategoryPrivate,
}