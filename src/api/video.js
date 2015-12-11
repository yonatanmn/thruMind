//export default function loadVideoSrc() {
//  return new Promise((resolve) => {
//    resolve({
//      src: 'http://az684138.vo.msecnd.net/nba-2014-timelines/09643393-2c07-40df-912c-8cff03b4dfdf.mp4',
//      time: Date.now()
//    });
//  });
//}
import { Router } from 'express';
import express from 'express';

let content = {
  src: 'http://az684138.vo.msecnd.net/nba-2014-timelines/09643393-2c07-40df-912c-8cff03b4dfdf.mp4',
  time: Date.now()
};

const router = new Router();


router.get('/', async (req, res, next) => {
  global.socket.emit('tes111', { hello: 'world' });
  try {
    console.log('get video');
    console.log(global.socket);
    setTimeout(function () {
      res.status(200).send(content);
    },2000);


  } catch (err) {
    next(err);
  }
});

import {all as getAllVideos, add as addVideo} from '../server/controllers/video';

router.get('/all', getAllVideos);

router.post('/', async (req, res)=>{
  console.log(req.body);

  addVideo(req, res);
});

export default router;
