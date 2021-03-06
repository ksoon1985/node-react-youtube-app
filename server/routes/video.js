const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");

const multer = require('multer');
var ffmpeg = require('fluent-ffmpeg');
const { Subscriber } = require('../models/Subscriber');

// STORAGE MULTER CONFIG
let storage = multer.diskStorage({

    // 저장될 장소
    destination:(req,file,cb)=>{
        cb(null,"uploads/");
    },
    // 저장될 이름
    filename:(req,file,cb)=>{
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    // 확장자 필터
    fileFilter:(req,file,cb)=>{
        const ext = path.extname(file.originalname)
        if(ext != '.mp4'){
            return cb(res.status(400).end('only mp4 is allowed'),false);
        }

        cb(null,true);
    }
})

const upload = multer({storage:storage}).single("file");

//=================================
//             Video
//=================================

router.post('/uploadfiles',(req,res)=>{

    // 비디오를 서버에 저장.
    upload(req,res,err=>{
        if(err){
            return res.json({success:false,err})
        }
        return res.json({
            success:true,
            url:res.req.file.path,
            fileName:res.req.file.filename
        })
    })
})

router.post('/uploadVideo',(req,res)=>{

    // 비디오 정보들을 저장한다.
    
    // client (variable) -> req.body에 담김
    const video = new Video(req.body) 

    //save : mongo db method
    video.save((err,doc)=>{
        if(err) return res.json({success:false,err})
        res.status(200).json({success:true}) 
    })
    
})

// 비디오들 가져오기 
router.get('/getVideos', (req,res)=>{

    // 비디오를 db 에서 가져와서 클라이언트에 보낸다.

    // mongo db에서 모든 비디오를 가져옴
    Video.find()
    .populate('writer') // populate를 해줘야 user모델의 모든 컬럼들을 가져올 수 있음(안해주면 id만 가져옴)
    .exec((err,videos)=>{
        if(err) return res.status(400).send(err);
        res.status(200).json({success:true,videos})
    })
    
})

// 비디오 상세 페이지
router.post('/getVideoDetail',(req,res)=>{

    Video.findOne({"_id":req.body.videoId})
    .populate('writer')
    .exec((err,videoDetail)=>{
        if(err) return res.status(400).send(err)
        return res.status(200).json({success:true, videoDetail})
    })
})

// 썸네일 생성 
router.post('/thumbnail',(req,res)=>{

    // 썸네일 생성 하고 비디오 러닝타입도 가져오기

    let filePath = ""
    let fileDuration = ""

    // ffmpeg 시스템 환경변수를 못가져오는 오류때문에 아래 코드 추가
    ffmpeg.setFfmpegPath('C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe')

    //비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function(err,metadata){
        console.dir(metadata); // all metadata
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    })

    // 썸네일 생성
    ffmpeg(req.body.url)
    .on('filenames',function(filenames){
        console.log('Will generate' + filenames.join(','))
        console.log(filenames)
        
        filePath = "uploads/thumbnails/"+filenames[0]
    })
    .on('end',function(){
        console.log('Screenshots taken');
        return res.json({success:true,url:filePath,fileDuration:fileDuration})
    })
    .on('error',function(err){
        console.error(err);
        return res.json({success:false,err});
    })
    .screenshots({
        // will take screenshots at 20% 40% 60% 80% of the video
        count: 3,
        folder: 'uploads/thumbnails',
        size:'320x240',
        // '%b' : input basename (filename w/o extension)
        filename : 'thumbnail-%b.png'
    })
})

// 구독한 비디오들 가져오기
router.post('/getSubscriptionVideos',(req,res)=>{

    // 자신의 id를 가지고 구독하는 사람들을 찾는다. 
    Subscriber.find({ userFrom : req.body.userFrom })
    .exec((err,subscriberInfo)=>{
        if(err) return res.status(400).send(err);

        // 내가 구독한 유투버들 
        let subscribedUser = [];

        subscriberInfo.map((subscriber,i)=>{
            subscribedUser.push(subscriber.userTo);
        })

        // 찾은 사람들의 비디오를 가지고 온다.
        Video.find({writer : { $in : subscribedUser}})
        .populate('writer')
        .exec((err,videos)=>{
            if(err) return res.status(400).send(err);
            res.status(200).json({success:true,videos})
        })

    })
})

module.exports = router;