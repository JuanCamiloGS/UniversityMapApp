import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, TouchableOpacity } from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import {Labs, Deps, Canchas, Parqs} from '../resources/Localizaciones.js'

Mapbox.setAccessToken('pk.eyJ1IjoianVhbmNhbWlsb2dzIiwiYSI6ImNqczFtZTAzNTF2dm80NHBkcjNtZnV4d28ifQ.O1btLai2y5Q0YR0PBWRV-w');


class Home extends Component<{}> {

  constructor () {
    super()
    this.state = {
      hidden: true
    }
    OptionSelect = this.OptionSelect;
    MapboxPoint = this.MapboxPoint;
    showMenu = this.showMenu.bind(this);
  }

  showMenu(){
    this.setState({
      hidden: !this.state.hidden
    })
  }

  

  MapboxPoint(props){
    const obj = props.obj;
    return  <Mapbox.PointAnnotation
              key={'P'+obj.id}
              id={'P'+obj.id}
              coordinate={[obj.lon, obj.lat]}>
              <TouchableOpacity style={styles.annotationContainer} onPress={() => showMenu(obj)}>
                <View style={styles.annotationFill}  />
              </TouchableOpacity>
            </Mapbox.PointAnnotation>;
  }

  OptionSelect(props) {
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
  }

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

        {this.state.hidden && 
        <View style={styles.floatingMenu}>
          <TouchableOpacity style={styles.closeButton}><Text>CERRAR</Text></TouchableOpacity>
        </View>
        }
        
      </View>
    );
  }
}

export default Home;

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingLeft: 2,
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
    },
    floatingMenu: {
      position: 'absolute',
      backgroundColor: 'white',
      left: width/20,
      bottom: 10,
      width: width-width/10,
      height: height/5,
      borderRadius: 5,
      elevation: 3
    },
    closeButton:{
      position: 'absolute', 
      top: 4,
      right: 7
    }
})
