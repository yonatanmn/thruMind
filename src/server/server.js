/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import '../../node_modules/babel-core/polyfill';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';

import React from 'react';
import ReactDOM from 'react-dom/server';
import Router from './../routes';
import Html from './../components/Html';
import assets from './assets.json';

const server = global.server = express();
const port = process.env.PORT || 5000;
server.set('port', port);


var mongoose = require('mongoose');

let uri = 'mongodb://yonatanmn:thruMindTest@ds056688.mongolab.com:56688/thru-mind-test';
mongoose.connect(uri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {});


//
// Register Node.js middleware
// -----------------------------------------------------------------------------
server.use(express.static(path.join(__dirname, 'public')));

server.use(bodyParser.json());

//
// Register API middleware
// -----------------------------------------------------------------------------
server.use('/api/content', require('./../api/content'));
server.use('/api/video', require('./../api/video'));
//
//server.get('/api/video', async (req, res, next) => {
//  let video = require('./api/video');
//  res.send(video);
//  //console.log('server video')
//});


//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------


server.get('*', async (req, res, next) => {
  try {
    let statusCode = 200;
    const data = { title: '', description: '', css: '', body: '', entry: assets.app.js };
    const css = [];
    const context = {
      onInsertCss: value => css.push(value),
      onSetTitle: value => data.title = value,
      onSetMeta: (key, value) => data[key] = value,
      onPageNotFound: () => statusCode = 404,
    };

    await Router.dispatch({ path: req.path, context }, (state, component) => {
      data.body = ReactDOM.renderToString(component);
      data.css = css.join('');
    });

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(statusCode).send('<!doctype html>\n' + html);
  } catch (err) {
    next(err);
  }
});

//
// Launch the server
// -----------------------------------------------------------------------------
server.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`The server is running at http://localhost:${port}/`);
});
