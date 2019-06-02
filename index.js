const express = require('express');
const app = express();

var bodyParser = require('body-parser');
// var busboyBodyParser = require('busboy-body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());

//parse multipart/form-data
// app.use(busboyBodyParser());

const path = require('path');

var multer  =   require('multer');
const router = express.Router();
app.use("/assets", express.static(path.join(__dirname, 'assets')));


var axios = require("axios");

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'assets/PhotoId');
    },
    filename: function (req, file, callback) {
        const ext = path.extname(file.originalname);
        callback(null, `${file.fieldname}-${Date.now()}${ext}`);
    }
});

var upload = multer({ storage : storage}).single('userPhotoId');

app.post('/uploadIdBase64',function(req,res){
    var imgUrl = req.body.img ? req.body.img : '';
    if(imgUrl){
        if(uploadBase64Image(imgUrl)){
            res.send("Success! File Uploaded successfully.");
        }else{
            res.end("Error! Something went wrong.Please try after sometime");
        }
    }
});

app.post('/uploadId',function(req,res){
    console.log(req.body);
    console.log('body: ' + JSON.stringify(req.body));
    upload(req,res,function(err) {
        if(err) {
            console.log("err",err);
            return res.end("Error uploading file.",err);
        }
        res.send("Success! File is uploaded successfully.");
    });
});

function uploadBase64Image(imgUrl){
    const url = "https://602e4790.ap.ngrok.io/predict";
    const data = {
        'data': imgUrl,//'http://www.khaosodenglish.com/upload/files/1438666401_VISAS1.jpg'
    }
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    axios.post(url, data, config)
        .then((result) => {
            console.log("result",result);
            return true;
        })
        .catch((err) => {
            console.log("err",err);
            return false;
        })
}

router.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/index.html'));
    //__dirname : It will resolve to your project folder.
});

//add the router
app.use('/', router);
app.listen(process.env.port || 9000);

console.log('Running at Port 9000');