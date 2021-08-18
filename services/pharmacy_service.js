const connection = require('../config/database')
const axios = require('axios')
const optimeService = require('./optime_service')

export const getAllPharmacies = async () => {
    let query = 'SELECT * FROM Pharmacy;'

    try {
        const pharmacies = await connection.promise().execute(query)
        return pharmacies[0]
    } catch (error) {
        throw new Error(`Get ALl Pharmacies: ${error.message}`)
    }
}

export const getNearestPharmacies = async (latitude, longitude) => {
    let nearest = 10   // 10 KM
    let nearestPharmacies = []
    let query = 'SELECT * FROM Pharmacy;'
    
    try {
        // Get all pharmacies
        let pharmacies = await connection.promise().execute(query)
        pharmacies = pharmacies[0]

        // Find location within 1 KM
        for (const pharmacy of pharmacies) {
            // Get Address of the pharmacy 
            let result = await axios.get(`http://user-profile-service:8000/address/${pharmacy.Pcy_Addr_ID}`) 
            let address = result.data.data

            let distance = findNearestPlace(latitude, longitude, address.Addr_Latitude, address.Addr_Longitude)
            // If this location is within 10KM of the user, add it to the list
            if(nearest > distance) {
                // Get Operation Time of the pharmacy
                let operationTimes = await optimeService.getOptByPharmacyId(pharmacy.ID)

                // Aggregate results
                pharmacy.Pcy_Address = address
                pharmacy.Pcy_OperationTimes = operationTimes
                pharmacy.Distance = distance
                nearestPharmacies.push(pharmacy)
            }
        }

        // Sort distance ascending
        return nearestPharmacies.sort((a,b) => a.distance - b.distance);
    } catch (error) {
        throw new Error(`Get Nearest Pharmacies: ${error.message}`)
    }
}

export const findNearestPlace = (lat1, lon1, lat2, lon2) => {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    dist = dist * 1.609344 

    return parseFloat(dist.toFixed(2))
} 

export const updatePharmacyImage = async (pharId, imagePath) => {
    let query = 'UPDATE Pharmacy SET Pcy_Image = ? WHERE ID = ? ;'
    
    try {
        await connection.promise().execute(query, [imagePath, pharId]);
    } catch (err) {
        throw new Error(`Update Pharmacy Image By Pharmacy ID: ${err.message}`)
    }
}