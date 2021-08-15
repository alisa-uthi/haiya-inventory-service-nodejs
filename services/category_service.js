const connection = require('../config/database')

export const getAllCategories = async () => {
    let query = 'SELECT * FROM Category;'
    try {
        const result = await connection.promise().query(query);
        return result[0]
    } catch (err) {
        throw new Error(`Get All Product Categories: ${err.message}`)
    }
}