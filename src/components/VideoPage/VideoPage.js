import AppStateStore from '../../stores/AppStateStore';
import {connector} from 'reflux-state-mixin';

import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './VideoPage.scss';
import Actions from '../../actions/VideoActions'

@withStyles(styles)
@connector(AppStateStore)
class VideoPage extends Component {

  static propTypes = {
    //maxLines: PropTypes.number,
  };

  static defaultProps = {
    //maxLines: 1,
  };

  handleClick(){
    Actions.onGetVideoSrc();
    Actions.onNewDogBorn();
  }

  handleClickGetAllVideos(){
    Actions.onGetAllVideos();
  }

  handleInputName(e){
    Actions.onInputName(e.target.value);
  }
  handleInputUrl(e){
    Actions.onInputUrl(e.target.value);
  }
  handleClickSaveNewVid(){Actions.onSaveVid()}

  render() {
    //let {videoSrc} = this.state
    let {dogs, videoSrc, url, name} = this.state;
    return (
        <div className="VideoPage">
          <video src={videoSrc} autoPlay controls/>
          <div>we have {dogs} dogs</div>
          <button onClick={this.handleClick}>click</button>
          <button onClick={this.handleClickGetAllVideos}>onGetAllVideos</button>
          <input type="text" placeholder="name" value={name} onChange={this.handleInputName}/>
          <input type="text" placeholder="url" value={url} onChange={this.handleInputUrl}/>
          <button onClick={this.handleClickSaveNewVid}>Click to save new vid</button>

        </div>
    );
  }

}

export default VideoPage;
