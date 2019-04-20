import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, TouchableOpacity, ScrollView, TextInput} from 'react-native';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import {Labs, Deps, Canchas, Parqs} from '../resources/Localizaciones.js'
import {Header, Icon, Left, Button} from 'native-base'
import ShapeSource from '@mapbox/react-native-mapbox-gl/javascript/components/ShapeSource';
import indoorMap1 from '../resources/1stfloor.json';
import indoorMap2 from '../resources/2ndfloor.json';
import {Floors} from '../resources/floors.js'

MapboxGL.setAccessToken('pk.eyJ1IjoianVhbmNhbWlsb2dzIiwiYSI6ImNqczFtZTAzNTF2dm80NHBkcjNtZnV4d28ifQ.O1btLai2y5Q0YR0PBWRV-w');


class Home extends Component<{}> {

  constructor (props) {
    super(props)
    this.state = {
      hidden: true,
      hidden2: false,
      pointName: "TEST NAME",
      pointDesc: "TEST DESC",
      floorMap: Floors[0].map,
      currentFloor: 1
    }
    OptionSelect = this.OptionSelect;
    MapboxPoint = this.MapboxPoint;
    showMenu = this.showMenu.bind(this);
    toggleVis = this.toggleVis.bind(this);
    changeFloor = this.changeFloor.bind(this);
    FloorButton = this.FloorButton.bind(this);
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

  changeFloor(props){
    this.setState({
      floorMap: props.map,
      currentFloor: props.floor
    })
  }

  FloorButton(props){
    color = '#eaedf2';
    if(props.floor == this.state.currentFloor){
      color = '#e0dd8d'
    }
    return <TouchableOpacity onPress={() => changeFloor(props)} 
            style={{
              backgroundColor: color,
              borderRadius: 3,
              marginVertical: 2
            }}>
            <Text style={{textAlign: 'center'}}>{props.floor}</Text>
           </TouchableOpacity>
  }

  MapboxPoint(props){
    const obj = props.obj;
    return  <MapboxGL.PointAnnotation
              key={'P'+obj.id}
              id={'P'+obj.id}
              coordinate={[obj.lon, obj.lat]}>
              <TouchableOpacity style={styles.annotationContainer} onPress={() => showMenu(obj)}>
                <View style={styles.annotationFill}  />
              </TouchableOpacity>
            </MapboxGL.PointAnnotation>;
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

        {/* Map Object */}
        <MapboxGL.MapView styleURL={'asset://bright.json'}
                        zoomLevel={16} 
                        centerCoordinate={[-74.8503,11.0191]} 
                        style={styles.container}
                        minZoomLevel={16}
                        compassEnabled={false}>
          {this.renderAnnotations()}
          <MapboxGL.ShapeSource id="indoorSource" shape={this.state.floorMap} >
            <MapboxGL.FillLayer id="whatever" style={mb_styles.buildings} minZoomLevel={17.5} />
            <MapboxGL.SymbolLayer id="points" style={mb_styles.pointers} minZoomLevel={19}/>
          </MapboxGL.ShapeSource>
        </MapboxGL.MapView>


        {/* Floating Input Object */}
        <View style={styles.floatingInput}>
          <TouchableOpacity style={{flex: 1, alignItems: 'center'}} onPress={() => this.props.navigation.openDrawer()}>
            <Icon name='menu' />
          </TouchableOpacity>
          <TextInput style={{flex: 7}} placeholder="Digite un destino..."></TextInput>
        </View>


        {/* Point Description and Menu */}
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


        {/* Floor Selection Object */}
        {!this.state.hidden2 &&
        <View style={styles.floatingFloors}>
          <Text style={{fontSize: 6, textAlign: 'center'}}>PISO</Text>
          <Icon name='md-arrow-dropup' style={{textAlign: 'center', color: 'gray', lineHeight: 15, fontSize: 15}}/>
          <ScrollView>
            {Floors.map((flo, i) => <FloorButton floor={flo.label} map={flo.map} key={'F'+flo.label} />)}
          </ScrollView>
          <Icon name='md-arrow-dropdown' style={{textAlign: 'center', color: 'gray', lineHeight: 15, fontSize: 15}}/>
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
    },
    floatingFloors: {
      position: 'absolute',
      backgroundColor: 'white',
      height: height/5,
      width: width/20,
      bottom: height/2-height/10,
      right: 5,
      borderRadius: 6,
      elevation: 3,
      padding: 2
    },
    floorButton: {
      backgroundColor: '#eaedf2',
      borderRadius: 3,
      marginVertical: 2
    }
})

const mb_styles = MapboxGL.StyleSheet.create({
  buildings: {
    fillColor: MapboxGL.StyleSheet.identity('color'),
    fillOutlineColor: 'black'
  },
  street: {
    lineColor: 'green',
  },
  pointers: {
    textField: MapboxGL.StyleSheet.identity('name')
  }

});
