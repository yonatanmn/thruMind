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

const app = global.app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 5000;
app.set('port', port);


var mongoose = require('mongoose');

let uri = 'mongodb://yonatanmn:thruMindTest@ds056688.mongolab.com:56688/thru-mind-test';
mongoose.connect(uri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {});


//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());


// This attaches the socket.io instance to the request object
app.use(function(req, res, next) {
  req.io = io; next();
});

import { graphql } from 'graphql';
import schema from './graphql-schemas/video';

app.use(bodyParser.text({ type: 'application/graphql' }));

app.post('/data', async (req, res) => {
  let result = await graphql(schema, req.body);
  res.status(200).send(result);
});


//
// Register API middleware
// -----------------------------------------------------------------------------

app.use('/api/content', require('./../api/content'));
app.use('/api/video', require('./../api/video'));


//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------


app.get('*', async (req, res, next) => {
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

