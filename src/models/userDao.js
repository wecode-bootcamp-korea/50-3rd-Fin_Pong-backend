const appDataSource = require("./dataSource")

const sampleLogin = async () => {
  try {
    return await appDataSource.query(
      `
        INSERT INTO users(name, mail, birthdate, phone_number) 
        VALUES ('Soohyeon', "sh96@gmail.com", "19961231", "01011111111")
        `
    )
  } catch (e) {
    console.error(e)
  }
}

module.exports = { sampleLogin }