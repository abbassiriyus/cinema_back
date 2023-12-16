const { Client } = require("pg")

// const pool = new Client({
//     user: "postgres",
//     host: "containers-us-west-143.railway.app",
//     database: "railway",
//     password: "GoLZRn8nFh9YgD8osXoS",
//     port: 5619
// })
const pool = new Client({
    user: "uzdubuz_id_rsa",
    host: "clocalhost",
    database: "uzdubuz_test",
    password: "o$n;y)_HLGwM",
    port: 5619
})
pool.connect(err => {
    if(err) {
        console.log("Connect Error");
    } else {
        console.log("Connect To PostgreSql");
    }
})

module.exports = pool