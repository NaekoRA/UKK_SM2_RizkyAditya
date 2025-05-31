const mysql = require('mysql2')
const koneksi = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'ukk_sm2_adit'
})
koneksi.connect((err)=>{
    if(err){
        console.error('error conection');
        return
    }
    console.log('berhasil terhubung');
})
module.exports = koneksi
