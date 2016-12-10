import React, { Component } from 'react';
import YouTube from 'react-youtube';
import 'whatwg-fetch';
import { createContainer } from 'meteor/react-meteor-data';
import { Tasks } from '../api/tasks';
//10.130.202.108
class App extends Component {

    constructor() {
        super();
        this.state = { id: ''};
    }
    componentDidMount() {
        const query = 'thalli pogathey';
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=1&key=AIzaSyCH1CsGdCFdEV2NFvpiDoYyblqO56mmg8Y`;
        const this2 = this;
        fetch(url)
            .then(function(response) {
                return response.json()
            }).then(function(json) {
            this2.setState({id: json.items[0].id.videoId});
        }).catch(function(ex) {
            console.log('parsing failed', ex)
        });
    }
    handleEnd() {
        console.log('song has ended');
    }
    render() {
        console.log('songs', this.props.song);
        const opts = {
            height: '390',
            width: '640',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 1
            }
        };
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

App.propTypes = {
    song: React.PropTypes.object.isRequired,
};

export default createContainer(() => {
    return {
        song: Tasks.find({}).fetch(),
    };
}, App);
