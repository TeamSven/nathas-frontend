import React, { Component } from 'react';
import YouTube from 'react-youtube';
import 'whatwg-fetch';
import { createContainer } from 'meteor/react-meteor-data';
import { Tasks } from '../api/tasks';
import { Params } from '../api/params';
import _ from 'lodash';
import './main.css';
//10.130.202.108
class App extends Component {

    constructor() {
        super();
        this.state = { id: ''};
    }
    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps', nextProps);
        if(!_.isUndefined(nextProps.song)) {
            const {request_url, request_string} = nextProps.song;
            console.log(request_url, request_string);
            if(_.isUndefined(request_url)) {
                const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${request_string}&type=video&maxResults=1&key=AIzaSyCH1CsGdCFdEV2NFvpiDoYyblqO56mmg8Y`;
                const this2 = this;
                fetch(url)
                    .then(function(response) {
                        return response.json()
                    }).then(function(json) {
                    console.log(json);
                    this2.setState({id: json.items[0].id.videoId});
                }).catch(function(ex) {
                    console.log('parsing failed', ex)
                });
            } else {
                this.setState({id: request_url.split('=')[1]});
            }
        }
        if(!_.isUndefined(nextProps.params)) {
            if (!_.isUndefined(nextProps.params.state)) {
                this.setState({state: nextProps.params.state});
            }
            if (!_.isUndefined(nextProps.params.volume)) {
                this.setState({volume: nextProps.params.volume});
            }
        }
    }
    handleEnd() {
        console.log('song has ended', this.props);
        Tasks.remove(this.props.song._id);
    }
    handleOnReady(event) {
        console.log('event', this.state);
        if(!_.isUndefined(event)) {
            this.setState({
                player: event.target,
            });
        }
    }
    handleStateChange() {
        console.log('called', this.state.state);
        if(!_.isUndefined(this.state.player)) {
            if(this.state.state === 'pause') {
                this.state.player.pauseVideo();
            }
            if(this.state.state === 'play') {
                this.state.player.playVideo();
            }
            if(this.state.volume === 'volumeup') {
                console.log('increasing volume');
                this.state.player.setVolume(this.state.player.getVolume() + 20);
                this.resetVolume();
            }
            if(this.state.volume === 'volumedown') {
                console.log('decreasing volume');
                this.state.player.setVolume(this.state.player.getVolume() - 20);
                this.resetVolume();
            }
        }
    }
    resetVolume() {
        const currentParams = Params.find({}).fetch()[0];
        Params.update(currentParams._id, {
            $set: { volume: '' },
        });
    }
    render() {
        console.log('render');
        this.handleStateChange();
        const opts = {
            height: '390',
            width: '640',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 1,
                controls: 0
            }
        };
        if(_.isUndefined(this.props.song)) {
            return <div className="centered">NOTHING TO PLAY! GO REQUEST SOME...</div>;
        } else {
            return (
                <div className="centered">
                    <YouTube
                        videoId={this.state.id}
                        opts={opts}
                        onEnd={() => this.handleEnd()}
                        onReady={(event) => this.handleOnReady(event)}
                    />
                </div>
            );
        }
    }
}

App.propTypes = {
    song: React.PropTypes.object.isRequired,
};

export default createContainer(() => {
    return {
        song: Tasks.find({}, { sort: { requested_at: 1 } }).fetch()[0],
        params: Params.find({}, { sort: { requested_at: 1 } }).fetch()[0],
    };
}, App);
