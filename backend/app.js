const express = require("express");
const app = express();
const port = 3000;
const dbSet = require("./src/plugins/db_set.js");
const dbQuery = require("./src/plugins/db_query.js");

// CORS 허용
const cors = require("cors");
app.use(cors({
    origin: ["http://localhost:8080"]
}));

// body parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//MySQL 연결
const mysql = require("mysql");
const config = require("./src/db_config.json");
const connection = mysql.createConnection(config);
connection.connect((err) => {
    if (err) throw err;
    console.log("SQL connected");
});
dbSet.setConnection(connection);


app.post("/api/", (req, res) => {
    if (req.body.userName && req.body.phoneNumber && req.body.couponType) {
        dbQuery.getUserInfo(connection, "create",req.body.userName, req.body.phoneNumber)
            .then((userid) => {
                if (userid === -1) {
                    console.log("이미 사용된 번호로 시도하였습니다.")
                    res.send({type:"duplicated", message:"이미 사용된 번호입니다."});
                } else {
                    console.log(`${userid} 유저가 쿠폰 발급을 요청했습니다.`);
                    dbQuery.getCoupon(connection, userid, req.body.couponType)
                        .then((result) => {
                            res.send(result);
                        })
                        .catch((err) => {
                            console.log(err);
                            res.send({type: "error", message: "서버에 문제가 발생했습니다."});
                        })
                }
            }).catch((err) => {
                res.send({type: "error", message: "서버에 문제가 발생했습니다."});
            })
    } else {
        res.send({type: "error", message: "비정상적인 접근입니다."});
    }
})

app.post("/api/history", (req, res) => {
    if (req.body.userName && req.body.phoneNumber) {
        dbQuery.getUserInfo(connection, "read", req.body.userName, req.body.phoneNumber)
            .then((userid) => {
                if (userid === -1) {
                    res.send({type:"unmatched", message:"해당 정보와 일치하는 사용자가 없습니다."});
                } else {
                    console.log(`${userid} 유저가 쿠폰 내역을 요청했습니다.`);
                    dbQuery.getHistory(connection, userid)
                        .then((result) => {
                            res.send(result);
                        })
                        .catch((err) => {
                            console.log(err);
                            res.send({type: "error", message: "서버에 문제가 발생했습니다."});
                        })
                }
            }).catch((err) => {
                res.send({type: "error", message: "서버에 문제가 발생했습니다."});
            })
    } else {
       res.send({type: "error", message: "비정상적인 접근입니다."});
    }
})


app.listen(port, () => {
    console.log(`Backend app listening on port ${port}`)
})