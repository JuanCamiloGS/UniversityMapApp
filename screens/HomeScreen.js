import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import {Labs, Deps, Canchas, Parqs} from '../resources/Localizaciones.js'

Mapbox.setAccessToken('pk.eyJ1IjoianVhbmNhbWlsb2dzIiwiYSI6ImNqczFtZTAzNTF2dm80NHBkcjNtZnV4d28ifQ.O1btLai2y5Q0YR0PBWRV-w');

class Home extends Component<{}> {
  
  renderAnnotations () {
    return (
      <OptionSelect slotChoice={this.props.slot}/>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Mapbox.MapView //styleURL={'https://puerti.co/mobility/uninorte.json'} 
                        zoomLevel={16} 
                        centerCoordinate={[-74.8503,11.0191]} 
                        style={styles.container}
                        minZoomLevel={16}>
          {this.renderAnnotations()}
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
    },
    annotationContainer: {
      width: 12,
      height: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      borderRadius: 6,
    },
    annotationFill: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: 'red',
      transform: [{ scale: 0.6 }],
    }
})

function MapboxPoint(props){
  const obj = props.obj;
  
  return  <Mapbox.PointAnnotation
            key={'P'+obj.id}
            id={'P'+obj.id}
            coordinate={[obj.lon, obj.lat]}>

            <View style={styles.annotationContainer}>
              <View style={styles.annotationFill} />
            </View>
            <Mapbox.Callout title={obj.nombre} />
          </Mapbox.PointAnnotation>;
}

function OptionSelect(props) {
  const option = props.slotChoice;
  switch(option) {
    case 0:
      return <View></View>;
      break;
    case 1:
      return <View>{Labs.map((lab, i) => <MapboxPoint obj={lab} key={i} />)}</View>;
      break;
    case 2:
      return <View>{Deps.map((dep, i) => <MapboxPoint obj={dep} key={i} />)}</View>;
      break;
    case 3:
      return <View>{Canchas.map((can, i) => <MapboxPoint obj={can} key={i} />)}</View>;
      break;
    case 4:
      return <View>{Parqs.map((par, i) => <MapboxPoint obj={par} key={i} />)}</View>;
      break;
    default:
      return <View></View>;
  }
  /*
  if (option==0) {
    return <View></View>;
  }else if(option==1){
    return <View>{Labs.map((lab, i) => <MapboxPoint obj={lab} key={i} />)}</View>;
  }else if(option==2){
    return <View>{Deps.map((dep, i) => <MapboxPoint obj={dep} key={i} />)}</View>;
  }else{
    return <View></View>;
  }
  */
}
