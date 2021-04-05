import React from "react";


import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import Slider from '@react-native-community/slider';
 

export default class SeekBar extends React.Component{

 
  millisToMinutesAndSeconds(millis) {
    if(millis){
      //There are 60,000 ms in a minute
      var minutes = Math.floor(millis / 60000);
      //toFixed - Convert a number into a string, rounding the number to keep 0 decimals 
      var seconds = (millis/ 1000).toFixed(0).substr(0,2);
     
      return (seconds == 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
    }
    return "...";
  }

  seekSong=(newSliderValue)=>{
    const {durationMillis,playbackInstance} = this.props;
    const newPositionMillis = (newSliderValue*durationMillis)/100;
    playbackInstance.setStatusAsync({
      positionMillis : newPositionMillis
    })
  }

  //Having it as an example for passing data from child to parent
  // callParentHandler = () =>{
  //  // if(this.nextSong){
  //     console.log("Reachhed end point");
  //     this.props.reachedEndPoint();
  //     // this.nextSong = false;
  //   // }
  // }


  render() {
    {
      const {durationMillis,positionMillis} = this.props;
      var sliderValue = 0;
      if (
        positionMillis != null &&
        durationMillis != null
      ) {
        
        sliderValue = Math.round((positionMillis / durationMillis)*100);
        
      }
    }
    return (
      <View style={{ margin: 20, width: "80%" }}>
        <Slider
          maximumValue={100}
          minimumValue={0}
          minimumTrackTintColor="#550088"
          maximumTrackTintColor="#000000"
          thumbTintColor="#550088"
          value={sliderValue}
          onSlidingComplete={(newSliderValue) => this.seekSong(newSliderValue)}
        />
        <View style={styles.textContainer}>
          <Text style={styles.positionText}>
            {this.millisToMinutesAndSeconds(this.props.positionMillis)}
          </Text>
          <Text style={styles.durationText}>
            {this.millisToMinutesAndSeconds(this.props.durationMillis)}
          </Text>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  positionText: {
    marginLeft: 15,
  },
  durationText: {
    marginRight: 5,
  },
});
