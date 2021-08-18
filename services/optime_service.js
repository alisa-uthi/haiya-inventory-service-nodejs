const connection = require('../config/database')

export const getOptByPharmacyId = async (pharId) => {
    let query = 'SELECT ID, Opt_Day, Opt_OpenHR, Opt_CloseHR FROM Operation_Time WHERE Opt_Pcy_ID = ?;'

    try {
        const result = await connection.promise().execute(query, [pharId])
        return result[0]
    } catch (error) {
        throw new Error(`Get Operation Time By Pharmacy ID: ${error.message}`)
    }
}