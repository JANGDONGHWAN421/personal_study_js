var cors = require('cors');
var fs = require('fs');
var express = require('express');
var multer = require('multer');
var app = express();
var data = new Array();

var file_destination;
var file_originalname;
var upload_name;
var upload_fullpath;

const dbconfig = require("./dbconnect.json")
const sftpconfig = require("./storageconnect.json")

var mysql = require('mysql');
var sftpStorage = require('multer-sftp');

var connection = mysql.createConnection({
    host: dbconfig.host,
    port: dbconfig.port,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
});

connection.connect();



var storage = sftpStorage({
    sftp: {
        host: sftpconfig.host,
        port: sftpconfig.port,
        username: sftpconfig.username,
        password: sftpconfig.password
    },
    destination: function(req, file, cb) {
        cb(null, 'uploads/') // /upload 부분을 다른 부분으로 바꾸면 파일의 저장 경로을 바꿀 수 있다.
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname)
    }
})

var upload = multer({ storage: storage })
app.use(cors());

app.get('/upload', (req, res) => { res.render('upload') })
app.get('/', function(req, res) {
    fs.readFile('index.html', function(err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });

});


// accept one file where the name of the form field is named photho
app.post('/upload', upload.single('myFile'), function(req, res) {


    data = req.file;

    file_destination = data.destination; // 파일이 가는 원격 저장소 경로
    file_originalname = data.originalname; // 파일의 원래이름과 확장자명
    upload_name = data.filename; //파일이 업로드 될때 이름
    upload_fullpath = data.path; //파일이 업로드 되는 폴더의 경로 파일 이름과 확장자명.

    console.log('---------------------------');
    console.log('---------------------------');
    console.log('---------------------------');
    console.log('---------------------------');
    console.log("이건 upload_fullpath " + '\n' + upload_fullpath);

    console.log('---------------------------');
    console.log("이건 upload_originalname " + '\n' + file_originalname);

    console.log('---------------------------');
    console.log("이건 upload_name " + '\n' + upload_name);

    console.log('---------------------------');
    console.log("이건 file_destination " + '\n' + file_destination);

    res.send("upload 성공 입니다.");



});


app.listen(3000);