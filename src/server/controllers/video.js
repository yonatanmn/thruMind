var Video = require('../models/video');

export function all(req, res) {
  Video.find({}).exec(function(err, videos) {
    if(!err) {
      res.json(videos);
    }else {
      console.log('Error in first query');
    }
  });
}

export function add(req, res) {
  Video.create(req.body, function (err) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    }
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
