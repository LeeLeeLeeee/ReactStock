const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5000;
const request = require("request-promise-native");
const cheerio = require("cheerio");
const createProxyMiddleware = require('http-proxy-middleware');
const { forEach_promise } = require("./module/func");
const read_csv = require("./module/func").read_csv;
const data = fs.readFileSync('./server/database.json');
const conf = JSON.parse(data);
const mysql = require('mysql');


const connection = mysql.createConnection({

  host: conf.host,

  user: conf.user,

  password: conf.password,

  port: conf.port,

  database: conf.database

});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post("/read/itooza", (req, res) => {
  var info_item = {};
  if(req.query.code === "") {
    res.send("ERR")
    return false;
  }
  var code_list = req.query.code.split(',');
  var get_stock_func = async (code) => {
    await request(
      "http://search.itooza.com/search.htm?seName=" + code,
      function (err, resx, body) {
        if (err) {
          console.log(err);
          return Promise.resolve("")
        } else {
          
          var $ = cheerio.load(body);
          var five_year_per = $(".item-data2 > table > tbody > tr:nth-child(2) > td:nth-child(1)" ).text().replace(/,/g,""); // 5년 PER
          var quarter_eps_con = $("#indexTable1 > table > tbody > tr:nth-child(1) > td:nth-child(2)" ).text().replace(/,/g,""); // 최근 4 분기 연결 EPS
          var quarter_eps = $("#indexTable1 > table > tbody > tr:nth-child(2) > td:nth-child(2)" ).text().replace(/,/g,""); // 최근 4 분기 개별 EPS
          var year_eps_con = $("#indexTable2 > table > tbody > tr:nth-child(1) > td:nth-child(2)" ).text().replace(/,/g,""); // 연도별 연결 EPS
          var year_eps = $("#indexTable2 > table > tbody > tr:nth-child(2) > td:nth-child(2)" ).text().replace(/,/g,""); // 연도별 개별 EPS
          var sum_eps_con = $("#indexTable3 > table > tbody > tr:nth-child(1) > td:nth-child(2)" ).text().replace(/,/g,""); // 분기별 연결 EPS
          var sum_eps = $("#indexTable3 > table > tbody > tr:nth-child(2) > td:nth-child(2)" ).text().replace(/,/g,""); // 분기별 개별 EPS
          info_item["A"+code] = {
            five_year_per: five_year_per,
            quarter_eps_con: quarter_eps_con,
            quarter_eps: quarter_eps,
            year_eps_con: year_eps_con,
            year_eps: year_eps,
            sum_eps_con: sum_eps_con,
            sum_eps: sum_eps,
          };
          return Promise.resolve("")
        }
      })
      return Promise.resolve("");
    }
    
    forEach_promise(code_list, get_stock_func).then(()=>{
      res.send(info_item)
    })
});

app.get("/read/listcsv", (req, res) => {
  var date = req.query.date.replace(/-/g, "");
  var path = "./server/" + date + ".tsv";

  fs.stat(path, (error, stats) => {
    fs.open(path, "r", (err, fd) => {
      if (err) {
        if (err.code === "ENOENT") {
          console.error("File doesn't exist");
          res.json("none");
          return;
        }
        throw err;
      }
      let buffer = new Buffer.alloc(stats.size);
      fs.read(fd, buffer, 0, buffer.length, 0, function (
        error,
        bytesRead,
        buffer
      ) {
        let data = buffer.toString("utf-8");
        var tsv_data = read_csv(data, "\t");
        var index = tsv_data[0].indexOf("업종 이름");
        tsv_data = tsv_data.filter(function (item) {
          if (item[index] !== "") return true;
          return false;
        });
        res.json(tsv_data);
      });
    });
  });
});


app.get("/api/get_stock", (req, res) => {
  let code = req.query.code;
  var sql = ""
  if(code !== undefined){
    sql = "select stock_cd, stock_name,stock_group,bookmark_flag from stock_list_tb where del_flag = '0' and stock_cd = '"+code+"'; "
  } else {
    sql = "select stock_cd, stock_name,stock_group,bookmark_flag from stock_list_tb where del_flag = '0'; "
  }
  connection.query(
    sql,
    (err, rows, fields) => {
        if (err === null) {
            res.send(rows);
        } else {
            console.log(err);
        }
    }
)
return;

});

app.post('/api/delete_stock', (req, res) => {
  let code = req.body.id;
  connection.query("DELETE from my_stock_list_tb where stock_cd = ? ",[code],function(err){
    if(err === null) {
      res.send("Complete")
    } else {
      console.log(err);
      res.send("err")
    }
  })
})

app.post('/api/insert_stock', (req, res) => {
  let code = req.body.code;

  let name = req.body.name;

  let date = req.body.date;

  let buyprice = +req.body.buyprice;

  let buynum = +req.body.buynum;

  let totalprice = (+buyprice) * (+buynum)

  let params = [code, name, date, buynum, buyprice, totalprice];

  connection.query(
    "select stock_cd as code, stock_name as name,buy_date,stock_number,each_price,total_price from my_stock_list_tb where stock_cd = ? " ,
    [code],
    (err, rows, fields) => {
        if (err === null) {
            if(rows.length === 0) { /* 삽입 */
              let sql = "INSERT INTO my_stock_list_tb (stock_cd, stock_name, buy_date,stock_number, each_price, total_price) VALUES (?,?, ?, ?, ?,?)";
              connection.query(sql, params, (err, rows, fields) => {
                if (err === null) {
                  res.send("END");
                } else {
                  res.send("END");
                  console.log(err);
                }
              });
            } else { /* 수정 */              
              let sql = "UPDATE my_stock_list_tb SET stock_cd = ?, stock_name = ?, buy_date = ?,stock_number =?, each_price =?, total_price =? WHERE stock_cd = ?";
              connection.query(sql, [code, name, date, buynum, buyprice, totalprice, code], (err, rows, fields) => {
                if (err === null) {
                  res.send("END");
                } else {
                  res.send("END");
                  console.log(err);
                }
              });
            }
        } else {
            console.log(err);
            res.send("END");
        }
    })

  return;
});

app.get("/api/mystock", (req, res) => {
  connection.query(
    "select stock_cd as code, stock_name as name,buy_date,stock_number as buyNum,each_price as buyPrice,total_price from my_stock_list_tb;",
    (err, rows, fields) => {
        if (err === null) {
            res.send(rows);
        } else {
            console.log(err);
        }
    }
)
return;

});

const poption = {
  target : 'http://localhost:4999',
  chageOrigin : true
}
const apiProxy = createProxyMiddleware('/py',poption)
app.use(apiProxy)
app.listen(port, () => console.log(`Listening on port ${port}`));
