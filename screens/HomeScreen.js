import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, TouchableOpacity, ScrollView, TextInput, Keyboard} from 'react-native';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import {Labs, Deps, Canchas, Parqs} from '../resources/Localizaciones.js'
import {Header, Icon, Left, Button} from 'native-base'
import ShapeSource from '@mapbox/react-native-mapbox-gl/javascript/components/ShapeSource';
import {General, Floors, POI} from '../resources/floors.js'
import Autocomplete from 'react-native-autocomplete-input';
var polyline = require('@mapbox/polyline');

MapboxGL.setAccessToken('pk.eyJ1IjoianVhbmNhbWlsb2dzIiwiYSI6ImNqczFtZTAzNTF2dm80NHBkcjNtZnV4d28ifQ.O1btLai2y5Q0YR0PBWRV-w');


class Home extends Component<{}> {

  constructor (props) {
    super(props)
    this.state = {
      hidden: true,
      hidden2: false,
      pointName: "TEST NAME",
      pointDesc: "TEST DESC",
      floorMap: Floors[1].map,
      currentFloor: 1,
      route: {
        "type": "LineString",
        "coordinates": [
        ]
      },
      query: ''
    }
    OptionSelect = this.OptionSelect;
    MapboxPoint = this.MapboxPoint;
    showMenu = this.showMenu.bind(this);
    toggleVis = this.toggleVis.bind(this);
    changeFloor = this.changeFloor.bind(this);
    FloorButton = this.FloorButton.bind(this);
    getRouteData = this.getRouteData.bind(this);
  }

  // Keyboard Control

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow () {
    this.setState({
      hidden2: true
    })
  }

  _keyboardDidHide () {
    this.setState({
      hidden2: false,
      query: ''
    })
  }

  // Informacion de punto

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

  findData(query) {

    if (query === '') {
      return [];
    }
    //making a case insensitive regular expression to get similar value from the film json
    const regex = new RegExp(`${query.trim()}`, 'i');
    //return the filtered film array according the query from the input
    return POI.filter(point => point['properties']['name'].search(regex) >= 0);
  }

  // Información Indoors

  changeFloor(props){
    this.setState({
      floorMap: props.map,
      currentFloor: props.floor
    })
  }

  getRouteData(){
    fetch('http://159.89.22.204:8002/route', {method: 'POST', body: '{"locations":[{"lat":11.019573,"lon":-74.849811,"type":"break"},{"lat":11.019805,"lon":-74.850563,"type":"break"}],"costing":"pedestrian","directions_options":{"units":"metres"}}'})
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          route: polyline.toGeoJSON(responseJson['trip']['legs'][0]['shape'],6)
        })
      })
      .catch((error) => {
        console.error(error);
      });
    
  }

  // Funciones de Componentes

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

  // Render

  render() {
    const query = this.state.query;
    const data = this.findData(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    const rows = data.length === 1 && comp(query, data[0]['properties']['name']) ? [] : data.slice(0,5);

    return (
      <View style={styles.container}>

        {/* Map Object */}
        <MapboxGL.MapView styleURL={'asset://style/bright.json'}
                        zoomLevel={16} 
                        centerCoordinate={[-74.8503,11.0191]} 
                        style={styles.container}
                        minZoomLevel={16}
                        compassEnabled={false}>
          {this.renderAnnotations()}
          <MapboxGL.ShapeSource id='outdoorSource' shape={General}>
            <MapboxGL.SymbolLayer id='majorPoints' style={mb_styles.majorPointers} filter={['has', 'name']} minZoomLevel={17} maxZoomLevel={19.2} />
          </MapboxGL.ShapeSource>

          <MapboxGL.ShapeSource id="indoorSource" shape={this.state.floorMap} >
            <MapboxGL.FillLayer id="rooms" style={mb_styles.buildings} filter={['==', 'building', 'university']} minZoomLevel={18.5}/>
            <MapboxGL.LineLayer id="roads" style={mb_styles.street} filter={['==', 'highway', 'footway']} minZoomLevel={18.5} />
            <MapboxGL.SymbolLayer id="points" style={mb_styles.pointers} minZoomLevel={19.2}/>
          </MapboxGL.ShapeSource>
          
          <MapboxGL.ShapeSource id='routeSource' shape={this.state.route}>
            <MapboxGL.LineLayer id='routeLayer' style={{lineColor:'red'}} />
          </MapboxGL.ShapeSource>
        </MapboxGL.MapView>


        {/* Floating Input Object */}
        {this.props.slot==0 &&
        <View style={styles.floatingInput}>
          <TouchableOpacity style={{flex: 1, alignItems: 'center'}} onPress={() => this.props.navigation.openDrawer()}>
            <Icon name='menu' />
          </TouchableOpacity>
          {/* <TextInput style={{flex: 7}} placeholder="Digite un destino..."></TextInput> */}
          <View style={{flex: 7}}>
            <Autocomplete
              data={rows} 
              defaultValue={query}
              onChangeText={text => this.setState({ query: text })}
              placeholder="Digite un destino..."
              keyExtractor={(item, index) => ("S"+index)}
              containerStyle={{margin: 2}}
              inputContainerStyle={{borderWidth: 0, borderBottomWidth: 1, marginBottom: 1}}
              listStyle={{borderBottomWidth: 0}}
              renderItem={({item, index} ) => (
                <TouchableOpacity onPress={() => this.setState({ query: item['properties']['name'] })}>
                  <Text style={styles.itemText}>
                    {item['properties']['name']} ({item.properties.level})
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
        }

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

        <Button onPress={getRouteData}><Text>Get JSON</Text></Button>
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
    },
    autocompleteContainer: {
      borderWidth: 0
    },
    itemText: {
      margin: 2
    }
})

const mb_styles = MapboxGL.StyleSheet.create({
  buildings: {
    fillColor: '#e8e3b7', //MapboxGL.StyleSheet.identity('color'),
    fillOutlineColor: 'black'
  },
  street: {
    lineColor: 'green',
    lineOpacity: 0.6,
    lineDasharray: [2,2]
  },
  pointers: {
    textField: MapboxGL.StyleSheet.identity('name'),
    textSize: 10
  },
  majorPointers: {
    textField: MapboxGL.StyleSheet.identity('name'),
    textSize: 9,
    iconImage: 'circle_11',
    iconSize: 0.5,
    textOffset: [0,-1]
  }

});
