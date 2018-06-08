import React, { Component } from 'react';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';
import Card from './components/Card';
import CardSection from './components/CardSection';
const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      loggedIn: token ? true : false,
      userId: null,
      playlists : null,
      activePlaylist: {
        name: null,
        songs: null,
        selected: null
      },
      cardFlipped: {
        cardId: null,
        cardData: null
      }
    }

    const params = this.getHashParams();
    const token = params.access_token;
    this.getHashParams = this.getHashParams.bind(this);
    this.getAllPlaylists = this.getAllPlaylists.bind(this);
    // this.getNowPlaylist = this.getNowPlaylist.bind(this);
    this.getSongsForPlaylist = this.getSongsForPlaylist.bind(this);
    if (token) {
      spotifyApi.setAccessToken(token);
    }

  }

  componentWillMount(){
    spotifyApi.getMe()
  .then(data => {
    this.setState({userId : data['id'] })
    console.log(this.state)
  }, (err) => {
    console.error(err);
    });

  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams;
  }

  getAllPlaylists() {
    spotifyApi.getUserPlaylists(this.state.userId)
    .then(data => {
      this.setState({ playlists: data.items })
      console.log(this.state)
    })
  }


  getSongsForPlaylist(id, name) {
    spotifyApi.getPlaylistTracks(this.state.userId,id)
    .then(data => {
      let currentPlaylist = {...this.state.activePlaylist};
      currentPlaylist.name = name;
      currentPlaylist.songs = data.items
      this.setState({ activePlaylist: currentPlaylist})
      console.log(this.state)
    });

  }

  getSongInfo(id) {
    let currentlyFlipped = {...this.state.cardFlipped};
    if(id === currentlyFlipped.cardId) {
      currentlyFlipped.cardId = null;
      currentlyFlipped.cardData = null;
      this.setState({ cardFlipped: currentlyFlipped});
    }else {
      currentlyFlipped.cardId = id;
    spotifyApi.getAudioFeaturesForTrack(id)
    .then(data => {
      currentlyFlipped.cardData = data;
      this.setState({ cardFlipped: currentlyFlipped });
      console.log(this.state.cardFlipped)
      });
    }

  }

  render() {
    let currentPlaylist = this.state.activePlaylist.name;
    let titlesOfPlaylists = "";
    let allPlaylistSongs = "";
    if(this.state.playlists) {
      titlesOfPlaylists = this.state.playlists.map(playlist => {
        if(playlist.name === this.state.activePlaylist.name){
          return <button className='playlist-button-active' onClick={this.getSongsForPlaylist.bind(this,playlist.id, playlist.name)}>{playlist.name}</button>
        }else{
          return <button className='playlist-button' onClick={this.getSongsForPlaylist.bind(this,playlist.id, playlist.name)}>{playlist.name}</button>
        }

      })
    }
    if(this.state.activePlaylist.name) {
      allPlaylistSongs = this.state.activePlaylist.songs.map(song => {
          if(this.state.cardFlipped.cardId === song.track.id) {
            let songData = this.state.cardFlipped.cardData
            return (
              <Card>
                <CardSection>
                  <div>
                  <img className='thumbnailStyle' src={song.track.album.images[2].url} alt=""/>
                  </div>
                  <div className='headerContentStyle'>
                  <p className='headerTextStyle-song'>{song.track.name}</p>
                  <p className='headerTextStyle-artist'>{song.track.artists[0].name}</p>
                  </div>
                </CardSection>
                <CardSection>
                  <div className='song-data-styling'>
                    <p className='headerTextStyle-song'>Acousticness: {songData.acousticness}</p>
                    <p className='headerTextStyle-song'>Danceability: {songData.danceability}</p>
                    <p className='headerTextStyle-song'>Energy: {songData.energy}</p>
                    <p className='headerTextStyle-song'>Liveness: {songData.liveness}</p>
                    <p className='headerTextStyle-song'>Loudness: {songData.loudness}</p>
                    <p className='headerTextStyle-song'>Tempo: {songData.tempo}</p>
                    <p className='headerTextStyle-song'>Time-Signature: {songData.time_signature}</p>
                    </div>
                </CardSection>
                <CardSection>
                  <button className='button-style' onClick={this.getSongInfo.bind(this, song.track.id)}>
                  <p className='button-text'>Back to Album Cover</p>
                    </button>
                </CardSection>
                </Card>
            )
          }else {
            return (
              <Card>
                <CardSection>
                  <div>
                  <img className='thumbnailStyle' src={song.track.album.images[2].url} alt=""/>
                  </div>
                  <div className='headerContentStyle'>
                    <p className='headerTextStyle-song'>{song.track.name}</p>
                    <p className='headerTextStyle-artist'>{song.track.artists[0].name}</p>
                  </div>
                </CardSection>
                <CardSection>
                  <img className='imageStyle' src={song.track.album.images[1].url} alt=""/>
                </CardSection>
                <CardSection>
                  <button className='button-style' onClick={this.getSongInfo.bind(this, song.track.id)}>
                  <p className='button-text'>Song Info</p>
                    </button>
                </CardSection>
                </Card>
            /* <button onClick={this.getSongInfo.bind(this,song.track.id)}>{song.track.name} by {song.track.artists[0].name}</button> */
          )
          }

      })
    }
    return (
      <div className="App">
        <a className='login-link' href='http://localhost:8888' > Login to Spotify </a>

        {/* {/* <button onClick={this.getUser}>
            Check Now Playing
          </button> */}
        <button className='see-your-playlists' onClick={this.getAllPlaylists}>
          See Your Playlists
          </button>
          <div className='playlist-button-container'>
          {
            this.state.activePlaylist.name ?
            <h3> You are currently viewing {this.state.activePlaylist.name}</h3>
            :
            ""
          }
          {titlesOfPlaylists}
          </div>
          <div className='all-cards'>
          {allPlaylistSongs}
          </div>
      </div>
    );
  }
}




export default App;