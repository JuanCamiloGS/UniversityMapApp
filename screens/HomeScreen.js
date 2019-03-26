import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';

Mapbox.setAccessToken('pk.eyJ1IjoianVhbmNhbWlsb2dzIiwiYSI6ImNqczFtZTAzNTF2dm80NHBkcjNtZnV4d28ifQ.O1btLai2y5Q0YR0PBWRV-w');

class Home extends Component<{}> {
  
  render() {
    return (
      <View style={styles.container}>
        <Mapbox.MapView styleURL={Mapbox.StyleURL.Street} zoomLevel={15} centerCoordinate={[11.256, 43.770]} style={styles.container}>
        </Mapbox.MapView>
      </View>
    );
  }
}

export default Home;

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingLeft: 3
    }
})
