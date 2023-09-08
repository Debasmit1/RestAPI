const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require('uuid');

app.set("view engine","ejs");
app.use(express.urlencoded({extended: true}));
app.set("views",path.join(__dirname,"/views"));
app.use(methodOverride("_method"));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'deltaApp',
  password:'MySql@143'
});

// let q = "SHOW TABLES";
let getRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.userName(),
        faker.internet.email(),
        faker.internet.password()
    ]
}

let PORT = 8080;

// app.get("/",(req,res)=>{
//     res.send("Welcome to HomePage");
// })

app.get("/",(req,res)=>{
    let q = "select count(*) from user";
    try {
        connection.query(q,(err,result)=>{
            if(err)throw err;
            let count = result[0]["count(*)"]
            res.render("home.ejs",{count});
        })
    } catch (error) {
        console.log(err);
        res.send("Some Error in DataBase");
    }
})

app.get("/user",(req,res)=>{
    let q = `SELECT * FROM user`;
    try {
        connection.query(q,(err,users)=>{
            if(err)throw err;
            res.render("showusers.ejs",{users});
        })
    } catch (error) {
        console.log(err);
        res.send("Some error in DB");
    }
});

app.get("/user/:id/edit",(req,res)=>{
    let { id } = req.params;
    console.log(id);
    let q = `SELECT * from user WHERE id='${id}'`;
    try {
        connection.query(q,(err,result)=>{
            if(err)throw err;
            let user = result[0];
            console.log(user);
            res.render("edit.ejs",{user});
        })
    } catch (error) {
        console.log(error);
        res.send("Some Error in DB");
    }
})

app.patch("/user/:id",(req,res)=>{
    let { id } = req.params;
    let { password: formPass, username: newUsername } = req.body;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try {
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user = result[0];
            console.log(user);
            if(formPass != user.password){
                res.send("Wrong Password");
            }else{
                let q2 = `UPDATE user SET username='${newUsername}' where id='${id}'`;
                connection.query(q2,(err,result)=>{
                    if(err)throw err;
                    // res.send(result);
                    res.redirect("/user");
                })
            }
        })
    } catch (error) {
        console.log(err);
        res.send("Some error in DB");
    }
})

app.get("/user/new",(req,res)=>{
    res.render("new.ejs");
})

app.post("/posts",(req,res)=>{
    let {username,email,password} = req.body;
    let id = uuidv4();
    let q="INSERT INTO user (username,email,password,id) VALUES (? , ? , ? , ?)";
    let ip = [username,email,password,id];

    try {
        connection.query(q,ip,(err,result)=>{
            if(err)throw err;
            // console.log(result);
            // res.send("Entered New Data");
            res.redirect("/user");
        })
    } catch (error) {
        console.log(error);
    }

})

app.get("/user/:id/delete",(req,res)=>{
    let {id} = req.params;
    let q = `SELECT * from user WHERE id='${id}'`;
    try {
        connection.query(q,(err,result)=>{
            if(err)throw err;
            let user = result[0];
            console.log(user);
            res.render("delete.ejs",{user});
        })
    } catch (error) {
        console.log(error);
        res.send("Some Error in DB");
    }
})

app.delete("/user/:id",(req,res)=>{
    let { id } = req.params;
    let { password: formPass, username: newUsername } = req.body;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try {
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user = result[0];
            console.log(user);
            if(formPass != user.password){
                res.send("Wrong Password");
            }else{
                let q2 = `DELETE FROM user where id='${id}'`;
                connection.query(q2,(err,result)=>{
                    if(err)throw err;
                    // res.send(result);
                    res.redirect("/");
                })
            }
        })
    } catch (error) {
        console.log(err);
        res.send("Some error in DB");
    }
})

app.listen(PORT,()=>{
    console.log(`Server is listening to ${PORT}`)
})


// let q = "INSERT INTO user (id,username,email,password) VALUES ?";
// //let user = [[1232,"123_newuser2","abc2@gmail.com","abc2"],[1233,"1233_newuser","ab3@gmail.com","abc3"]];

// let data = [];

// for(let i=1;i<=100;i++){
//     data.push(getRandomUser());
// }

// try {
//     connection.query(q,[data],(err,result)=>{
//         if(err)throw err;
//         console.log(result);
// })
// } catch (error) {
//     console.log(error);
// }
// connection.end();