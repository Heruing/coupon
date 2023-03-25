function getUserInfo(connection, getType, name, phonenumber) {
    const query = "SELECT * FROM users WHERE phonenumber = ?"
    const param = [phonenumber];
    return new Promise((resolve, reject) => {
        let result;
        connection.query(query, param, (err, results, fields) => {
            if (err) reject(err);
            result = results;
            if (result.length === 0) {
                if (getType === "create") {
                    const newUser = { name: name, phonenumber: phonenumber };
                    connection.query("INSERT INTO users SET ?", newUser, (error, results, fields) => {
                        if (error) reject(error);
                        resolve(results.insertId);
                    });
                }
            } else {
                if (result[0].name == name) resolve(result[0].userid);
            }
            resolve(-1);
        })
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

function getCoupon(connection, userid, couponType) {
    const query = "SELECT * FROM coupons WHERE userid = ? and coupon_type = ?"
    const params = [userid, couponType];
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, results, fields) => {
            if (err) reject(err);
            if (results.length === 0) {
                let couponCode = makeCoupon(12);
                let flag;
                const checkQuery = "SELECT * FROM coupons WHERE coupon_code = ?"
                connection.query(checkQuery, [couponCode], (err, results, fields) => { flag = results.length; });
                while (flag) {
                    couponCode = makeCoupon(12);
                    connection.query(checkQuery, [couponCode], (err, results, fields) => { flag = results.length; });
                }
                const newCoupon = { userid: userid, coupon_code: couponCode, coupon_type: couponType};
                connection.query("INSERT INTO coupons SET ?", newCoupon, (error, results, fields) => {
                    if (error) reject(error);
                    console.log(`${userid}번 유저에게 ${couponType} 쿠폰을 발급합니다.`)
                    resolve({type:"approve", message:couponCode});
                });
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


exports.getUserInfo = getUserInfo;
exports.getCoupon = getCoupon;
exports.getHistory = getHistory;