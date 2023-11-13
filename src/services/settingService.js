const settingDao = require('../models/settingDao')

const viewMonthFamily = async( familyId, year ) => {
  return await settingDao.viewMonthFamily( familyId, year )
}

const viewMonthPrivate = async( userId, year ) => {
  return await settingDao.viewMonthPrivate( userId, year )
}

const viewCategoryFamily = async( familyId, date ) => {
  return await settingDao.viewCategoryFamily( familyId, date )
}

const viewCategoryPrivate = async( userId, date ) => {
  return await settingDao.viewCategoryPrivate( userId, date )
}

module.exports = {
  viewMonthFamily,
  viewMonthPrivate,
  viewCategoryFamily,
  viewCategoryPrivate,
}