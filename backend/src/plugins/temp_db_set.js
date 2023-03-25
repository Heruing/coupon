function setTempDB(connection) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM types"
        let result = [];
        connection.query(query, (err, results, fields) => {
            if (err) reject(err);
            result = results;
            if (result.length === 0) {
                const coupons = [
                    { coupon_type: "newyear2023", coupon_name: "신년맞이", start_at: "2023-01-22 00:00:00", end_at: "2023-04-07 23:59:59" },
                    { coupon_type: "newsemester2023-1", coupon_name: "신학기 이벤트", start_at: "2023-03-01 00:00:00", end_at: "2023-04-07 23:59:59" },
                    { coupon_type: "aprilPool2023", coupon_name: "만우절", start_at: "2023-03-25 00:00:00", end_at: "2023-04-07 23:59:59" },
                    { coupon_type: "temporary1", coupon_name: "임시쿠폰1", start_at: "2023-01-01 00:00:00", end_at: "2023-12-31 23:59:59" },
                    { coupon_type: "temporary2", coupon_name: "임시쿠폰2", start_at: "2023-01-01 00:00:00", end_at: "2023-12-31 23:59:59" },
                    { coupon_type: "temporary3", coupon_name: "임시쿠폰3", start_at: "2023-01-01 00:00:00", end_at: "2023-12-31 23:59:59" },
                ];
                connection.query(
                    "INSERT INTO types (coupon_type, coupon_name, start_at, end_at) VALUE ?",
                    [coupons.map(coupon => [coupon.coupon_type, coupon.coupon_name, coupon.start_at, coupon.end_at])],
                    (err, results, fields) => {
                        if (err) reject(err);
                    }
                );
                console.log("Inserted temporary coupons");
                connection.query(query, (err, results, fields) => {
                    if (err) reject(err);
                    result = results;
                    resolve(result);
                });
            } else {
                resolve(result);
            }
        })
    })
}

exports.setTempDB = setTempDB;