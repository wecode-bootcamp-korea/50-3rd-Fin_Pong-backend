const { appDataSource } = require('../utils/dataSource');

const insertUuid  = async(uuid) => {
  const result = await appDataSource.query(`
    INSERT INTO families(auth_code)
    VALUES( ? );
  `,
  [ uuid ])
  return result.insertId;
};

const insertUserFamilyId = async(userData, familyId) => {
  const result = await appDataSource.query(`
    INSERT INTO users_families(user_id, family_id, role_id)
    VALUES( ?, ?, ? );
  `,
  [ userData.userId, familyId, 1 ])
  if (result.insertId === 0) {
    error.throwErr(500, 'DATA_INSERTION_FAILED');
    }
  return result;
};

const findFamilyId = async(authCode) => {
  return await appDataSource.query(`
    SELECT
      id AS familyId
    FROM families WHERE auth_code = ?;
  `,
  [ authCode ]);
};

const addFamilyBook = async(userId, familyId) => {
  const result = await appDataSource.query(`
    INSERT INTO users_families(user_id, family_id, role_id)
    VALUES( ?, ?, ?);
  `,
  [ userId, familyId, 0 ])
  if (result.insertId === 0) {
    error.throwErr(500, 'DATA_INSERTION_FAILED');
    }
  return result;
};

const getFamilyAuthCode = async( familyId ) => {
  const [result] = await appDataSource.query(`
    SELECT auth_code
    FROM families
    WHERE families.id = ?
  `,
  [ familyId ])
  return result.auth_code;
};

module.exports = {
  insertUuid,
  insertUserFamilyId,
  findFamilyId,
  addFamilyBook,
  getFamilyAuthCode,
}