import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, TouchableOpacity, ScrollView, TextInput} from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import {Labs, Deps, Canchas, Parqs} from '../resources/Localizaciones.js'
import {Header, Icon, Left} from 'native-base'

Mapbox.setAccessToken('pk.eyJ1IjoianVhbmNhbWlsb2dzIiwiYSI6ImNqczFtZTAzNTF2dm80NHBkcjNtZnV4d28ifQ.O1btLai2y5Q0YR0PBWRV-w');


class Home extends Component<{}> {

  constructor (props) {
    super(props)
    this.state = {
      hidden: true,
      pointName: "TEST NAME",
      pointDesc: "TEST DESC"
    }
    OptionSelect = this.OptionSelect;
    MapboxPoint = this.MapboxPoint;
    showMenu = this.showMenu.bind(this);
    toggleVis = this.toggleVis.bind(this);
    //console.log(this.props.navigation)
  }

  showMenu(obj){
    this.setState({
      hidden: false,
      pointName: obj.nombre,
      pointDesc: obj.descripcion
    })
  }

  toggleVis(){
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
        <View style={styles.floatingInput}>
          <TouchableOpacity style={{flex: 1, alignItems: 'center'}} onPress={() => this.props.navigation.openDrawer()}>
            <Icon name='menu' />
          </TouchableOpacity>
          <TextInput style={{flex: 7}} placeholder="Digite un destino..."></TextInput>
        </View>

        {!this.state.hidden && 
        <ScrollView style={styles.floatingMenu}>
          
          <View style={styles.menuContent}>
            <Text style={{fontWeight: 'bold'}}>{this.state.pointName}</Text>
            <Text>{this.state.pointDesc}</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={toggleVis}>
            <Text style={{fontSize: 10}}> CERRAR </Text>
          </TouchableOpacity>
        </ScrollView>
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
    floatingInput: {
      position: 'absolute',
      left: width/20,
      top: 20,
      width: width-width/10,
      backgroundColor: 'white',
      borderRadius: 5,
      elevation: 3,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    floatingMenu: {
      position: 'absolute',
      backgroundColor: 'white',
      left: width/20 + 2,
      bottom: 10,
      width: width-width/10,
      height: height/5,
      borderRadius: 5,
      elevation: 3
    },
    closeButton:{
      position: 'absolute', 
      top: 0,
      right: 0,
      elevation: 1,
      borderRadius: 3,
      backgroundColor: '#fca9a9',
    },
    menuContent: {
      paddingVertical: 14,
      paddingHorizontal: 10,
    }
})
