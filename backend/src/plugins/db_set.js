function setConnection(connection) {
    //DB name
    const dbname = "coupons";
    //DB 확인 후 연결
    connection.query(`CREATE DATABASE IF NOT EXISTS ${dbname}`, (err, rows) => {
        if (err) {
            console.error("Error creating database:", err);
        }
    });
    connection.query(`USE ${dbname}`, (err, rows) => {
        if (err) {
            console.error("Error creating database:", err);
        }
        console.log("Set database successfully.");
    });
    
    // table 확인
    createTable("users");
    createTable("coupons");
    function createTable(tableName) {
        let makeQuery;
        if (tableName === "users"){
            makeQuery = `CREATE TABLE IF NOT EXISTS users (
                userid INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(30) NOT NULL,
                phonenumber VARCHAR(20) NOT NULL
            )`
        } else if (tableName === "coupons") {
            makeQuery = `CREATE TABLE IF NOT EXISTS coupons (
                id INT AUTO_INCREMENT,
                userid INT NOT NULL,
                coupon_code VARCHAR(255) NOT NULL,
                coupon_type VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id, coupon_code),
                FOREIGN KEY (userid) REFERENCES users(userid)
            )`
        }
        connection.query(makeQuery, (err, result) => {
            if (err) {
                console.error('Error creating table: ' + err.stack);
                return;
            }
            console.log(`Set ${tableName} table successfully`);
        });
    }
}

exports.setConnection = setConnection;