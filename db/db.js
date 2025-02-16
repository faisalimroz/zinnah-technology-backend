const mySql=require('mysql2')

const db = mySql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'taskDB',
  });
  
  db.connect((err) => {
    if (err){ 
        console.log('db connection faild');
        throw err
    };
    console.log("Connected to MySQL database.");
  });
  
  module.exports = db;