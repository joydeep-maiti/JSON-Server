const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const body = require('body-parser')
var multer = require('multer')
const port = process.env.PORT || 4000;
server.use(body.json());

// var express = require('express');
// var app = express();

// var cors = require('cors');

// app.use(cors())
// app.use(router);
server.use(body.urlencoded({ extended: true }));
server.use(middlewares);

var fs = require('fs');
var dir = './Documents';

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

var DIR = "./Documents/"
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, DIR)
    },
    filename: function (req, file, cb) {
        console.log(file, "inside", req.body.id)
        cb(null, req.body.id + '-' + (file.originalname.toLowerCase()))
    }
})

var upload = multer({ storage: storage }).any()
server.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        console.log('----', req.body, req.body.file)
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        return res.status(200).send(req.file)

    })

});
server.get('/download', function (req, res) {
    console.log('download hit');
    if (req.query) {
        var reqid = req.query.reqid;
        var fileName = req.query.fileName;
        try {
            const file = `${__dirname}/Documents/` + reqid + `-` + fileName;
            res.download(file);
        } catch (err) {
            console.log(err);
        }
    } else {

    }

});
server.use(router);
server.listen(port, () => console.log(port, "server is running in 4000"));;