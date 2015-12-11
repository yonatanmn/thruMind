import Reflux from 'reflux';
import StateMixin from 'reflux-state-mixin';
import Actions from '../actions/VideoActions';
import http from './../core/HttpClient';
//import socket from 'socket.io';
import io from 'socket.io-client';
//var socket = io();
var socket = io.connect('http://localhost:5000');

var AppStateStore = Reflux.createStore({
  mixins: [StateMixin.store],
  listenables: Actions,

  init(){
    console.log('asdww');
    socket.on('tes111', function(newState) {
      console.log('tes111 from store');
      console.log(newState);
      //this.setState(newState);
    }.bind(this));
  },

  getInitialState: function(){      //that's a must! 
    return{
      videoSrc:'',
      dogs:3,
      name:'',
      url:''
    }
  },

  onNewDogBorn: function() {
    this.setState({dogs: this.state.dogs + 1});
  },


  async onGetVideoSrc() {
    const res = await http.get(`/api/video`);
    this.setState({videoSrc: res.src});
  },

  async onGetAllVideos() {
    //const res = await http.get(`/api/video/all`);
    const res = await http.get(`/test`);
    console.log(res);
    //this.setState({videoSrc: res.src});
  },

  onInputName(name){
    this.setState({name: name})
  },

  onInputUrl(url){
    this.setState({url: url})
  },

  onSaveVid(){
    let {name, url} = this.state;

    http.post(`/api/video`, {name, url});
  }

});

export default AppStateStore;