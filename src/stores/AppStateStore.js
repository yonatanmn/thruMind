import Reflux from 'reflux';
import StateMixin from 'reflux-state-mixin';
import Actions from '../actions/VideoActions';
import http from './../core/HttpClient';

var AppStateStore = Reflux.createStore({
  mixins: [StateMixin.store],
  listenables: Actions,

  init(){
    http.post(`/api/video/all`);
    const socket = http.connectSocket;
    socket.on('videos', function(videos) {
      //console.log('videos from store', videos);
      this.setState({videos});
    }.bind(this));

  },

  getInitialState: function(){      //that's a must!
    return{
      videos: [{a:222}],
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

  /*async onGetAllVideos() {
    const res = await http.get(`/api/video/all`);
    console.log(res);
  },*/

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