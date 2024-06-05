const { Client } = require("pg")

const pool = new Client({
    user: "postgres",
    host: "containers-us-west-143.railway.app",
    database: "railway",
    password: "GoLZRn8nFh9YgD8osXoS",
    port: 5619
})
// const pool = new Client({
//     user: "abbasuz1_abbas",
//     host: "localhost",
//     database: "abbasuz1_new",
//     password: "e}THGjp4j6Y_",
//     port: 5619
// })
pool.connect(err => {
    if(err) {
        console.log("Connect Error");
    } else {
        console.log("Connect To PostgreSql");
    }
})

module.exports = pool