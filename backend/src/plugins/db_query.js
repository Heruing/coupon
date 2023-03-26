function getTypes(connection) {
    let query = "SELECT coupon_type, coupon_name FROM types"
    return new Promise((resolve, reject) => {
        connection.query(query, (err, results, fields) => {
            if (err) reject(err);
            resolve(results.reverse());
        })
    })
}

function getAvailables(connection) {
    let query = "SELECT coupon_type, coupon_name FROM types WHERE start_at <= NOW() AND NOW() <= end_at"
    return new Promise((resolve, reject) => {
        connection.query(query, (err, results, fields) => {
            if (err) reject(err);
            resolve(results.reverse());
        })
    })
}

function getUserInfo(connection, getType, name, phonenumber) {
    const query = "SELECT * FROM users WHERE phonenumber = ?"
    const param = [phonenumber];
    return new Promise((resolve, reject) => {
        connection.query(query, param, (err, results, fields) => {
            if (err) reject(err);
            if (results.length === 0) {
                if (getType === "create") {
                    createUser(connection, name, phonenumber)
                        .then(res=> {resolve(res)})
                        .catch(err => {reject(err)})
                } else resolve(-1);
            } else {
                if (results[0].name === name) resolve(results[0].userid);
                else resolve(-1);
            }
        })
    })
}

function createUser(connection, name, phonenumber) {
    return new Promise((resolve, reject) => {
        const newUser = { name: name, phonenumber: phonenumber };
        connection.query("INSERT INTO users SET ?", newUser, (err, results, fields) => {
            if (err) reject(err);
            resolve(results.insertId);
        });
    })
}

function makeCoupon(n) {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let couponCode = "";
    for (let i = 0; i < n; i++) {
        couponCode += chars[(Math.floor(Math.random() * chars.length))];
    }
    return couponCode;
}

function checkCoupon(connection, couponCode) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM coupons WHERE coupon_code = ?"
        connection.query(query, [couponCode], (err, results, fields) => {
            if (err) reject(err);
            resolve(results.length);
        });
    })
}

function insertCoupon(connection, userid, couponCode, couponType) {
    return new Promise((resolve, reject) => {
        const newCoupon = { userid: userid, coupon_code: couponCode, coupon_type: couponType };
        connection.query("INSERT INTO coupons SET ?", newCoupon, (err, results, fields) => {
            if (err) reject(err);
            resolve(results);
        });
    })
}

function getCoupon(connection, userid, couponType, n=0) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM coupons WHERE userid = ? and coupon_type = ?"
        const params = [userid, couponType];
        connection.query(query, params, (err, results, fields) => {
            if (err) reject(err);
            if (results.length === 0) {
                let couponCode;
                couponCode = makeCoupon(12);
                checkCoupon(connection, couponCode)
                    .then((res) => {
                        if (0 < res) {
                            console.log(`동일한 쿠폰 번호가 확인되어 로직을 재실행합니다.`);
                            getCoupon(connection, userid, couponType, n+1)
                                .then((inres) => resolve(inres))
                                .catch(err => reject(err));
                        } else {
                            insertCoupon(connection, userid, couponCode, couponType)
                            .then(() => {
                                    console.log(`쿠폰 번호가 유일하므로 ${couponType}쿠폰을 발급합니다.`);
                                    resolve({type:"approve", message:couponCode});
                                })
                            .catch(err => reject(err));
                        }
                    })
                    .catch((err) => reject(err));
            } else {
                console.log(`${userid}번 유저는 ${couponType} 쿠폰을 이미 발급 받았습니다.`)
                resolve({type:"inapprove", message:results[0].coupon_code});
            }
        })
    })
}

function getHistory(connection, userid) {
    return new Promise((resolve, reject) => {
        console.log(`${userid}번 유저의 발급 내역 요청입니다.`)
        connection.query("SELECT coupon_code, coupon_type, created_at FROM coupons WHERE userid = ?", [userid], (err, results, fields) => {
            if (err) reject(err);
            if (results.length === 0) {
                resolve({type:"none", message:"해당 정보로 생성된 쿠폰이 없습니다."});
            } else {
                resolve({type:"history", message:results.reverse()});
            }
        })
    })
}





exports.getTypes = getTypes;
exports.getAvailables = getAvailables;
exports.getUserInfo = getUserInfo;
exports.getCoupon = getCoupon;
exports.getHistory = getHistory;