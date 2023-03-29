const express = require("express");
const cron = require("node-cron");
const app = express();
const port = 3000;
const dbSet = require("./src/plugins/db_set.js");
const dbQuery = require("./src/plugins/db_query.js");
const tempDBset = require("./src/plugins/temp_db_set.js");     //  DB 내용 임시 삽입용 코드

// CORS 허용
const cors = require("cors");
app.use(cors({
    origin: ["http://localhost:8080"]
}));

// body parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// MySQL 연결
const mysql = require("mysql");
const config = require("./src/db_config.json");
const connection = mysql.createConnection(config);
connection.connect((err) => {
    if (err) throw err;
    console.log("SQL connected");
});
// 데이터베이스 테이블 세팅
dbSet.setConnection(connection);

// 임시 쿠폰 추가
tempDBset.setTempDB(connection);

// 현재 사용 가능한 쿠폰 세팅
let couponTypes, couponAvailables;
function hourJob() {
    dbQuery.getTypes(connection)
        .then(res => {couponTypes = res})
        .catch(err => {console.log(err)})
    dbQuery.getAvailables(connection)
        .then(res => {couponAvailables = res})
        .catch(err => {console.log(err)})
    console.log("Update Coupon informations")
}
hourJob();
cron.schedule("0 0 * * * *", hourJob);  // 매 시간마다 쿠폰 정보 업데이트


// 쿠폰 정보 요청
app.get("/api/", (req, res) => {
    res.send({couponTypes: couponTypes, couponAvailables: couponAvailables});
})


// 쿠폰 발급 요청 시
app.post("/api/", (req, res) => {
    if (req.body.userName && 10 <= req.body.phoneNumber.length && req.body.couponType) {
        let flag = 0;
        for (let i=0; i < couponAvailables.length; i++){
            if (couponAvailables[i].coupon_type === req.body.couponType) {
                flag = 1;
                break;
            }
        }
        if (flag) {
            dbQuery.getUserInfo(connection, "create", req.body.userName, req.body.phoneNumber)
                .then((userid) => {
                    if (userid === -1) {
                        console.log("이미 사용된 번호로 시도하였습니다.")
                        res.send({type:"duplicated", message:"이미 사용된 번호입니다."});
                    } else {
                        console.log(`${userid}번 유저가 쿠폰 발급을 요청했습니다.`);
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
                    return res.send({type: "error", message: "서버에 문제가 발생했습니다."});
                })
        } else {
            return res.send({type: "error", message: "해당 쿠폰이 존재하지 않습니다."});
        }
    } else {
        return res.send({type: "error", message: "비정상적인 접근입니다."});
    }
})

// 쿠폰 조회 요청 시
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