var Reflux = require('reflux');
var StateMixin = require('reflux-state-mixin');
var Actions = require('../actions/VideoActions');
import http from './../core/HttpClient';


var AppStateStore = Reflux.createStore({
  mixins: [StateMixin.store],
  listenables: Actions, //or any other way of listening...  

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
    const res = await http.get(`/api/video/all`);
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