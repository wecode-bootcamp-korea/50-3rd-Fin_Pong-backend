const { appDataSource } = require('../utils/dataSource');
const error = require('../utils/error');

const postFamilyWithUuid = async (uuid) => {
  const result = await appDataSource.query(
    `
    INSERT INTO families(auth_code)
    VALUES( ? );
  `,
    [uuid],
  );
  return result.insertId;
};

const findFamilyId = async (authCode) => {
  return await appDataSource.query(
    `
    SELECT
      id AS familyId
    FROM families WHERE auth_code = ?;
  `,
    [authCode],
  );
};

const getFamilyAuthCode = async (familyId) => {
  const [result] = await appDataSource.query(
    `
    SELECT auth_code
    FROM families
    WHERE families.id = ?
  `,
    [familyId],
  );
  return result['auth_code'];
};

module.exports = {
  postFamilyWithUuid,
  findFamilyId,
  getFamilyAuthCode,
};
