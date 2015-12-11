var Video = require('../models/video');


function getAllVideos(cb){
  Video.find({}).exec(function(err, videos) {
    if(!err) {
      cb(videos);
    }else {
      console.log('Error in first query');
    }
  });
}

function emitAllVideos(req){
  getAllVideos(function (videos) {
    req.io.sockets.emit('videos', videos);
  });
}

export function all(req, res) {
  //getAllVideos(res.json);

  emitAllVideos(req);

  res.status(200).send();

}

export function add(req, res) {
  Video.create(req.body, function (err) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    }
    emitAllVideos(req);


    res.status(200).send('Added successfully');
  });
}

export function remove(req, res) {
  var query = { id: req.body.id };
  Topic.findOneAndRemove(query, function(err, data) {
    if(err) console.log('Error on delete');
    res.status(200).send('Removed Successfully');
  });
}
