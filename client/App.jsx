import React, { Component } from 'react';
import YouTube from 'react-youtube';
import 'whatwg-fetch';
import { createContainer } from 'meteor/react-meteor-data';
import { Tasks } from '../api/tasks';
import _ from 'lodash';
//10.130.202.108
class App extends Component {

    constructor() {
        super();
        this.state = { id: ''};
    }
    componentWillReceiveProps(nextProps) {
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
    }
    handleEnd() {
        console.log('song has ended', this.props);
        Tasks.remove(this.props.song._id);
    }
    render() {
        const opts = {
            height: '390',
            width: '640',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 1
            }
        };
        if(_.isUndefined(this.props.song)) {
            return <div>NOTHING TO PLAY! GO REQUEST SOME...</div>;
        } else {
            return (
                <div className="App">
                    <YouTube
                        videoId={this.state.id}
                        opts={opts}
                        onEnd={() => this.handleEnd()}
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
    };
}, App);
