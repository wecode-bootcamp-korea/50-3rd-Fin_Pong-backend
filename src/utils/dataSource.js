const {DataSource} = require('typeorm');
const dotenv = require('dotenv')
dotenv.config()

const appDataSource = new DataSource({
    type : process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
})

const testDataSource = new DataSource({
    type : process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

// appDataSource.initialize()
//     .then(() => {
//         console.log('Data Source has been initialized!')
//     })
//     .catch((err) => {
//         console.error('Error occured during Data Source initialization', err)
//     })

async function initializeDataSource() {
    try {
        await appDataSource.initialize();
        console.log('Data Source has been initialized!');
    } catch (err) {
        console.error('Error occurred during Data Source initialization', err);
    }
}

module.exports = { appDataSource,initializeDataSource,testDataSource }