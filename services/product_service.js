const connection = require('../config/database')

export const getAllProducts = async () => {
    let query 
    query = 'SELECT p.ID, p.Prd_TradeName, p.Prd_TradeCode, p.Prd_CompName, p.Prd_GenericName, '
    query += 'p.Prd_GenericAdvice, p.Prd_Prereq, p.Prd_Detail, p.Prd_PrdQtyUnit, c.Category, pm.Prd_Image, cg.Pcy_ID, cg.AvailQty, cg.Price, cg.ExpireDate '
    query += 'FROM Product p '
    query += 'INNER JOIN Category c ON c.ID = p.Prd_Category_ID '
    query += 'INNER JOIN Catalog cg ON cg.Prd_ID = p.ID '
    query += 'LEFT JOIN Product_Image pm ON pm.Pim_Prd_ID = p.ID;'
    
    try {
        const result = await connection.promise().execute(query);
        return result[0]
    } catch (err) {
        throw new Error(`Get All Products: ${err.message}`)
    }
}

export const getProductById = async (id) => {
    let query 
    query = 'SELECT p.ID, p.Prd_TradeName, p.Prd_TradeCode, p.Prd_CompName, p.Prd_GenericName, '
    query += 'p.Prd_GenericAdvice, p.Prd_Prereq, p.Prd_Detail, p.Prd_PrdQtyUnit, c.Category, pm.Prd_Image, cg.Pcy_ID, cg.AvailQty, cg.Price, cg.ExpireDate '
    query += 'FROM Product p '
    query += 'INNER JOIN Category c ON c.ID = p.Prd_Category_ID '
    query += 'INNER JOIN Catalog cg ON cg.Prd_ID = p.ID '
    query += 'LEFT JOIN Product_Image pm ON pm.Pim_Prd_ID = p.ID '
    query += 'WHERE p.ID = ? ;'
    
    try {
        const result = await connection.promise().execute(query, [id]);
        return result[0][0]
    } catch (err) {
        throw new Error(`Get Product By ID: ${err.message}`)
    }
}

export const getProductsByCatgoryId = async (catId) => {
    let query 
    query = 'SELECT p.ID, p.Prd_TradeName, p.Prd_TradeCode, p.Prd_CompName, p.Prd_GenericName, '
    query += 'p.Prd_GenericAdvice, p.Prd_Prereq, p.Prd_Detail, p.Prd_PrdQtyUnit, pm.Prd_Image, cg.Pcy_ID, cg.AvailQty, cg.Price, cg.ExpireDate '
    query += 'FROM Product p '
    query += 'INNER JOIN Category c ON c.ID = p.Prd_Category_ID '
    query += 'INNER JOIN Catalog cg ON cg.Prd_ID = p.ID '
    query += 'LEFT JOIN Product_Image pm ON pm.Pim_Prd_ID = p.ID '
    query += 'WHERE c.ID = ? ;'
    
    try {
        const result = await connection.promise().execute(query, [catId]);
        return result[0]
    } catch (err) {
        throw new Error(`Get All Products In Given Category: ${err.message}`)
    }
}

export const getProductsByPharmacyId = async (pharmacyId) => {
    let query 
    query = 'SELECT p.ID, p.Prd_TradeName, p.Prd_TradeCode, p.Prd_CompName, p.Prd_GenericName, '
    query += 'p.Prd_GenericAdvice, p.Prd_Prereq, p.Prd_Detail, p.Prd_PrdQtyUnit, c.Category, pm.Prd_Image, '
    query += 'cg.Lot, cg.AvailQty, cg.Price, cg.ExpireDate '
    query += 'FROM Product p '
    query += 'INNER JOIN Category c ON c.ID = p.Prd_Category_ID '
    query += 'INNER JOIN Catalog cg ON cg.Prd_ID = p.ID '
    query += 'LEFT JOIN Product_Image pm ON pm.Pim_Prd_ID = p.ID '
    query += 'WHERE cg.Pcy_ID = ? ;'
    
    try {
        const result = await connection.promise().execute(query, [pharmacyId]);
        return result[0]
    } catch (err) {
        throw new Error(`Get All Products In Given Pharmacy: ${err.message}`)
    }
}

export const getProductsByCategoryAndPharmacy = async (catId, pharmacyId) => {
    let query 
    query = 'SELECT p.ID, p.Prd_TradeName, p.Prd_TradeCode, p.Prd_CompName, p.Prd_GenericName, '
    query += 'p.Prd_GenericAdvice, p.Prd_Prereq, p.Prd_Detail, p.Prd_PrdQtyUnit, c.Category, pm.Prd_Image, '
    query += 'cg.Lot, cg.AvailQty, cg.Price, cg.ExpireDate '
    query += 'FROM Product p '
    query += 'INNER JOIN Category c ON c.ID = p.Prd_Category_ID '
    query += 'INNER JOIN Catalog cg ON cg.Prd_ID = p.ID '
    query += 'LEFT JOIN Product_Image pm ON pm.Pim_Prd_ID = p.ID '
    query += 'WHERE c.ID = ? AND cg.Pcy_ID = ? ;'
    
    try {
        const result = await connection.promise().execute(query, [catId, pharmacyId]);
        return result[0]
    } catch (err) {
        throw new Error(`Get All Products In A Given Category Associated With A Given Pharmacy: ${err.message}`)
    }
}

export const getProdImageByProdId = async (productId) => {
    let query 
    query = 'SELECT Prd_Image '
    query += 'FROM Product_Image '
    query += 'WHERE Pim_Prd_ID = ? ;'
    
    try {
        const result = await connection.promise().execute(query, [productId]);
        return result[0]
    } catch (err) {
        throw new Error(`Get Product Images By Product ID: ${err.message}`)
    }
}

export const insertProductImage = async (productId, imagePath) => {
    let query = 'INSERT INTO Product_Image (Pim_Prd_ID, Prd_Image) VALUES (?, ?) ;'
    
    try {
        const result = await connection.promise().execute(query, [productId, imagePath]);
        return result[0].insertId
    } catch (err) {
        throw new Error(`Insert Product Image By Product ID: ${err.message}`)
    }
}

export const updateProductImage = async (imageId, imagePath) => {
    let query = 'UPDATE Product_Image SET Prd_Image = ? WHERE ID = ? ;'
    
    try {
        await connection.promise().execute(query, [imagePath, imageId]);
    } catch (err) {
        throw new Error(`Update Product Image By Image ID: ${err.message}`)
    }
}