const XLSX = require ('xlsx');
const db = require('../models/db')
const bcrypt = require('bcryptjs')

exports.importExcel = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'no file' })
    
    try {
        const workbook = XLSX.readFile(req.file.path)
        const sheetName = workbook.SheetNames[0]
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

        const insertData = await Promise.all(data.map(async (row) => {
            const hashedPassword = await bcrypt.hash(row.password, 10)
            return [
                row.username,
                row.email,
                hashedPassword
            ]
        }))
        const sql = 'INSERT INTO users (username,email,password) VALUES ?'

        db.query(sql, [insertData], (err, results) => {
            if (err) return res.status(500).json({ msg: err.message })
            res.status(200).json({
                msg: 'data imported succes',
                inserted:results.affectedRows})
        })
    }catch(error){
        res.status(500).json({msg:error.message})
    }
}