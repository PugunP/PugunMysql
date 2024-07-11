// Open Call Express
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const port = process.env.PORT || 5050; //localhost:5050

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//model view controller
app.set("view engine","ejs")

// MySQL Connect phpMyAdmin
const pool = mysql.createPool({
  connectionLimit: 10,
  connectTimeout: 20,
  host: "localhost", //www.google.com/sql or server IP Address  http://127.0.0.1/dashboard/
  user: "root",
  password: "",
  database: "nodejs_beers", // Connect Database from beers.sql (Import to phpMyAdmin)
});

//(1)GET
//GET (เรียกข้อมูลขึ้นมาดู) 
//GET All Beers (beers.sql)

var obj = {} // global variable

//สร้าง GET สำหรับรองรับการเเสดงผลหน้า Front-end ส่วนของ Post ไว้บนสุด
// app.get("/additem", (req,res) => {
//     res.render("additem")
// })

app.get("", (req, res) => {
  pool.getConnection((err, connection) => {
    //err คือ connect ไม่ได้ or connection คือ connect ได้บรรทัดที่  13-19
    if (err) throw err;
    console.log("connection id", connection.threadId); // ให้ print บอกว่า connect ได้ไหม
    console.log(`connection id : ${connection.threadId}`); //ต้องใช้` อยู่ตรงที่เปลียนภาษา

    connection.query("SELECT * FROM `beers`", (err, rows) => {
      connection.release();
      if (!err) {
        //Back-end : Postman Test --> res.send(rows)
        //front-end : ทำการ package  ข้อมูลที่ต้องการส่ง เพื่อทำการส่องข้อมูลไปได้ทั้งชุด

        //-------- Model od Data -------//
        obj = {beers: rows, Error : err}

        //------controller-----//
        res.render("index", obj)
        res.json(rows);
      } else {
        console.log(err);
        res.status(500).send(err);
      }
    });
  });
});

// Copy 23-42 มาปรับแก้ code ใหม่
// สร้างหน้าย่อยดึงข้อมูลเฉพาะ id ที่ต้องการ 123, 124, 125
app.get("/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    //err คือ connect ไม่ได้ or connection คือ connect ได้บรรทัดที่  13-19
    if (err) throw err;
    console.log("connection id", connection.threadId); // ให้ print บอกว่า connect ได้ไหม
    console.log(`connection id : ${connection.threadId}`); //ต้องใช้` อยู่ตรงที่เปลียนภาษา

    connection.query(
      "SELECT * FROM beers WHERE `id` = ?",
      req.params.id,
      (err, rows) => {
        connection.release();
        if (!err) {
          //ถ้าไม่ error จะใส่ค่าของตัวแปล rows
          // console.log(rows)
        //   res.json(rows);
        obj = {beers : rows, Error : err}
        res.render("showbyid.ejs", obj)
        } else {
          console.log(err);
          res.status(500).send(err);
        }
      }
    );
  });
});

//Add new GET เปลียน PATH และใส่ตัวแปล 2 ตัวคือ name, id
app.get("/getname_id/:name&:id", (req, res) => {
  pool.getConnection((err, connection) => {
    //err คือ connect ไม่ได้ or connection คือ connect ได้บรรทัดที่  13-19
    if (err) throw err;
    console.log("connection id", connection.threadId); // ให้ print บอกว่า connect ได้ไหม
    // console.log(`connection id : ${connection.threadId}`) //ต้องใช้` อยู่ตรงที่เปลียนภาษา

    connection.query(
      "SELECT * FROM beers WHERE `id` = ? OR `name` LIKE ? ",
      [req.params.id, req.params.name],
      (err, rows) => {
        connection.release();
        if (!err) {
          //ถ้าไม่ error จะใส่ค่าของตัวแปล rows
          // console.log(rows)
        //   res.json(rows);
        obj = {beers : rows, Error : err}
        res.render("getnameid.ejs", obj)
        } else {
          console.log(err);
          res.status(500).send(err);
        }
      }
    );
  });
});

//(2)POST --> INSERT DATA TO DATABASE
// ใช้คำสั่งที่ให้สามารถรับข้อมูล x-www-form-urlencoded ทดสอบด้วย Postman ลงฐานข้อมูลได้
// app.use(bodyParser.urlencoded({ extended: false })); //เริ่มทำงานตรงนี้
app.post("/additem", (req, res) => {
    const params = req.body;
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error connecting to the database:", err);
        res.status(500).send(err);
        return;
      }
  
      connection.query(`SELECT COUNT(id) AS count FROM beers WHERE id = ?`, [params.id], (err, rows) => {
        if (err) {
          connection.release();
          console.error("Error checking data in the database:", err);
          res.status(500).send(err);
          return;
        }
  
        if (!rows[0].count) {
          connection.query("INSERT INTO beers SET ?", params, (err, rows) => {
            connection.release();
            if (!err) {
              res.render("additem", { Error: err, mesg: `Success adding data ${params.name}` });
            } else {
              console.error("Error inserting data into the database:", err);
              res.render("additem", { Error: err, mesg: `Error adding data ${params.name}` });
            }
          });
        } else {
          connection.release();
          res.render("additem", { Error: err, mesg: `Cannot add data, ID ${params.id} already exists` });
        }
      });
    });
  });

//(3) DELETE
app.delete("/delete/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connection id : ?", connection.threadId);
    // ลบข้อมูลโดยใช้ id
    connection.query(
      "DELETE FROM `beers` WHERE `beers` .`id` = ?",
      [req.params.id],
      (err, rows) => {
        connection.release();
        if (!err) {
          res.send(`${[req.params.id]} is complete delete item`);
        } else {
          console.log(err);
        }
      }
    );
  });
});

//(4r)PUT ทำการ UPDATE DATABASE
app.put("/update", (req, res) => {
  pool.getConnection((err, connection) => {
    console.log("connection id : ?", connection.threadId);

    //สร้างตัวแปรแบบกลุ่ม
    const { id, name, tagline, description, image } = req.body;

    //UPDATE ข้อมูลต่างๆตามลำดับ โดยใช้เงื่อนไข id
    connection.query(
      `UPDATE beers SET name = ?, tagline = ?, description = ?, image = ? WHERE id = ?`,
      [name, tagline, description, image, id],
      (err, rows) => {
        connection.release();
        if (!err) {
          res.send(`${name} is complete update item`);
        } else {
          console.log(err);
        }
      }
    );
  });
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
