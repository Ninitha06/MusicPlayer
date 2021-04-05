
import React from 'react';
import { StyleSheet, Text, View,Image, TouchableOpacity,Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

import SeekBar from './components/SeekBar';

const { width, height } = Dimensions.get("window");
const imageSize = width - 100;

const audioBookList = [
  {
    title: "Master",
    author: "Anirudh Ravichander",
    source: "MassTamilan",
    uri:
      "https://masstamilan2019download.com/tamil/2020%20Tamil%20Songs/Master/Kutti%20Story-Masstamilan.In.mp3",
    image:
      "https://masstamilan.in/wp-content/uploads/2020/10/Master-songs1.jpg",
  },
  { 
    title: "Dharala Prabhu",
    author: "Anirudh Ravichander",
    source: "MassTamilan",
    uri:
      "https://masstamilan2019download.com/tamil/2020%20Tamil%20Songs/Dharala%20Prabhu/Dharala%20Prabhu%20Title%20Track-Masstamilan.in.mp3",
    image:
      "https://masstamilan.in/wp-content/uploads/2020/01/Dharala-Prabhu.jpg",
  },
  {
    title: "Soorarai Pottru",
    author: "GV Prakash Kumar",
    source: "MassTamilan",
    uri:
      "https://masstamilan2019download.com/tamil/2020%20Tamil%20Songs/Soorarai%20Pottru/Kaattu%20Payale-Masstamilan.in.mp3",
    image:
      "https://masstamilan.in/wp-content/uploads/2020/10/Soorarai-Pottru-Songs-150x150.jpg",
  },
];

export default class App extends React.Component{
  constructor(){
    super();
    this.state = {
      isPlaying: false,
      playbackInstance: null,
      currentIndex: 0,
      volume: 1.0,
      durationMillis: 1,
      positionMillis: 0,
    }
  }
  
 

componentDidMount = async () => {
    try {
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        shouldDuckAndroid: true,
        staysActiveInBackground: true,
        // When set to true, the playback Audio is too low
        playThroughEarpieceAndroid : false
      })
      this.loadAudio();
    }
    catch (e) {
      console.log(e);
    }
  }


  loadAudio = async()=> {
  
    try {
      const playbackInstance = new Audio.Sound()
      const source = {
        uri: audioBookList[this.state.currentIndex].uri
      }

      const status = {
        shouldPlay: this.state.isPlaying,
        volume : this.state.volume
      }
      playbackInstance.setOnPlaybackStatusUpdate(this.setPlaybackStatus)
      await playbackInstance.loadAsync(source, status, false);
      this.setState({
        playbackInstance: playbackInstance,
        nextSong : true
      });
      
    } catch (e) {
      console.log(e);
    }
  }

  setPlaybackStatus = (status) => {
  
    if (status.didJustFinish) {
      this.handleNextTrack();
    }
    this.setState({
      durationMillis: status.durationMillis,
      positionMillis: status.positionMillis,
    });
  }

  handlePlayPause = async () => {
    const {playbackInstance} = this.state
   
    this.state.isPlaying
      //playbackInstance.pauseAsync();
      ? await playbackInstance.setStatusAsync({ shouldPlay: false })
      : await playbackInstance.playAsync(); 
    
    this.setState({
      isPlaying : !this.state.isPlaying
    })
  }

  handlePreviousTrack = async() => {
    const { playbackInstance, currentIndex } = this.state;
    if(playbackInstance)
    {
      await playbackInstance.setStatusAsync({ shouldPlay: false })
      
      await playbackInstance.unloadAsync();
      
      this.setState({
        currentIndex : (currentIndex-1<0? audioBookList.length-1 : currentIndex-1)
      })
      this.loadAudio();
    }
  }
  


  handleNextTrack = async () => {
  const { playbackInstance, currentIndex } = this.state;
    if (playbackInstance) {
      await playbackInstance.setStatusAsync({ shouldPlay: false })
      await playbackInstance.unloadAsync();
      this.setState({
        currentIndex: ((currentIndex + 1) > (audioBookList.length-1) ? 0 : currentIndex + 1)
      })
      this.loadAudio();
    }
  }

  render() {
     const { playbackInstance, currentIndex } = this.state;
   
     
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: audioBookList[currentIndex].image }}
          style={styles.image}
        />
        {/*example reference : include reachedEndPoint = {this.changeCurrentIndex} to get data from child */}
        <SeekBar
          durationMillis={this.state.durationMillis}
          positionMillis={this.state.positionMillis}
          playbackInstance={playbackInstance}
        ></SeekBar>
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={this.handlePreviousTrack}
            style={styles.control}
          >
            <Ionicons name="play-back" color="#444" size={48}></Ionicons>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.handlePlayPause}
            style={styles.control}
          >
            {this.state.isPlaying ? (
              <Ionicons name="pause-circle" color="#444" size={48}></Ionicons>
            ) : (
              <Ionicons name="play-circle" color="#444" size={48}></Ionicons>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.handleNextTrack}
            style={styles.control}
          >
            <Ionicons name="play-forward" color="#444" size={48}></Ionicons>
          </TouchableOpacity>
        </View>
        {playbackInstance ? (
          <View style={styles.trackInfo}>
            <Text style={[styles.trackInfoText, styles.largeText]}>
              {audioBookList[currentIndex].title}
            </Text>
            <Text style={[styles.trackInfoText, styles.smallText]}>
              {audioBookList[currentIndex].author}
            </Text>
            <Text style={[styles.trackInfoText, styles.smallText]}>
              {audioBookList[currentIndex].source}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: { width: imageSize, height: imageSize },
  controls: { flexDirection: "row" },
  control: { margin: 20 },
  trackInfo: {
    padding: 40,
    backgroundColor: "#fff",
  },

  trackInfoText: {
    textAlign: "center",
    flexWrap: "wrap",
    color: "#550088",
  },
  largeText: {
    fontSize: 22,
  },
  smallText: {
    fontSize: 16,
  },
});
