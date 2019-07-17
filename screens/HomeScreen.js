import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, TouchableOpacity, ScrollView, TextInput, Keyboard, Image} from 'react-native';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
//import {Labs, Deps, Canchas, Parqs} from '../resources/Localizaciones.js'
//import {Labs, Deps, Canchas, Parqs} from '../resources/floors.js'
//import {General, Floors, POI} from '../resources/floors.js'
import {Header, Icon, Left, Button} from 'native-base'
import ShapeSource from '@mapbox/react-native-mapbox-gl/javascript/components/ShapeSource';
import Autocomplete from 'react-native-autocomplete-input';
var polyline = require('@mapbox/polyline');
import Geolocation from 'react-native-geolocation-service';
import ImageIcon from '../resources/icon.png'
import StarIcon from '../resources/star.png'

//MapboxGL.setAccessToken('pk.eyJ1IjoianVhbmNhbWlsb2dzIiwiYSI6ImNqczFtZTAzNTF2dm80NHBkcjNtZnV4d28ifQ.O1btLai2y5Q0YR0PBWRV-w');
MapboxGL.setAccessToken('pk.Not needed')

var dummy = {
  "coords": {
    "longitude": -74.849811,
    "latitude": 11.019573
  }
}

class Home extends Component<{}> {

  constructor (props) {
    super(props)

    OptionSelect = this.OptionSelect;
    MapboxPoint = this.MapboxPoint;
    showMenu = this.showMenu.bind(this);
    toggleVis = this.toggleVis.bind(this);
    closeVis = this.closeVis.bind(this);
    changeFloor = this.changeFloor.bind(this);
    FloorButton = this.FloorButton.bind(this);
    getRouteData = this.getRouteData.bind(this);
    selectedLocation = this.selectedLocation.bind(this);
    selectedOrigin = this.selectedOrigin.bind(this);
    RouteDescription = this.RouteDescription.bind(this);
    dataFetcher = this.dataFetcher.bind(this);

    Labs = this.props.specific[0];
    Deps = this.props.specific[1];
    Canchas = this.props.specific[2];
    Parqs = this.props.specific[3];

    General = this.props.wide[0];
    Floors = this.props.wide[1];
    POI = this.props.wide[2];
    Outdoors = this.props.wide[3];

    this.state = {
      isPermissionGranted: false,
      hidden: true,
      hidden2: false,
      hidden3: true,
      hidden4: true,
      pointCurrent: {
        "type": "Point",
        "coordinates": [0,0],
        "hidden": true,
        "properties": {}
      },
      pointOrig: {"properties": {"name":"Tu posición"}},
      floorMap: Floors[1].map,
      currentFloor: 1,
      route: {
        "type": "LineString",
        "coordinates": [],
        "hidden": true
      },
      legs: [],
      query: '',
      oriquer: ''
    }

    this.onSourceLayerPress = this.onSourceLayerPress.bind(this);
  }

  // Keyboard Control

  async componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    const isGranted = await MapboxGL.requestAndroidLocationPermissions();
    this.setState({
      isPermissionGranted: isGranted
    });
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow () {
    this.setState({
      hidden2: true,
      hidden: true
    })
  }

  _keyboardDidHide () {
    this.setState({
      hidden2: false,
      hidden: this.state.pointCurrent['hidden'] || false , // Could be better
      query: ''
    })
  }

  // Informacion de punto

  showMenu(obj){
    this.setState({
      hidden: false,
      hidden3: false,
      pointCurrent: obj
    })
  }

  toggleVis(){
    this.setState({
      hidden: !this.state.hidden
    })
  }

  closeVis(){
    this.setState({
      hidden: true,
      hidden3: true,
      pointCurrent: {
        "type": "Point",
        "coordinates": [0,0],
        "hidden": true,
        "properties": {}
      },
      pointOrig: {"properties": {"name":"Tu posición"}},
      oriquer: '',
      route: {
        "type": "LineString",
        "coordinates": [],
        "hidden": true
      },
      legs: []
    });

  }

  findData(serch) {
    if (serch === '') {
      return [];
    }
    const regex = new RegExp(`${serch.trim()}`, 'i');
    return POI.filter(point => point['properties']['name'].search(regex) >= 0);
  }

  selectedLocation(obj){
    this.setState({ 
      //query: obj['properties']['name'],
      query: '',
      route: {
        "type": "LineString",
        "coordinates": [],
        "hidden": true
      },
      legs: []
    }); 
    showMenu(obj);
    Keyboard.dismiss();
  }

  selectedOrigin(obj){
    this.setState({ 
      //oriquer: obj['properties']['name'],
      oriquer: '',
      pointOrig: obj,
      route: {
        "type": "LineString",
        "coordinates": [],
        "hidden": true
      },
      legs: []
    });
    Keyboard.dismiss();
  }

  // Información Indoors

  changeFloor(props){
    this.setState({
      floorMap: props.map,
      currentFloor: props.floor
    })
  }

  dataFetcher(position,destiny){
    fetch('http://159.89.22.204:8002/route', {
      method: 'POST', 
      body: JSON.stringify(
        {
          "locations": [
            {
              "lat": position['coords']['latitude'],
              "lon": position['coords']['longitude'],
              "type": "break"
            },
            {
              "lat": destiny['latitude'],
              "lon": destiny['longitude'],
              "type": "break"
            },
          ],
          "costing":"pedestrian",
          "directions_options":{"units":"metres","language":"es-ES"}
        }
      )})
      .then((response) => response.json())
      .then((responseJson) => {
        if(!responseJson.hasOwnProperty("error")){
          this.setState({
            route: polyline.toGeoJSON(responseJson['trip']['legs'][0]['shape'],6),
            legs: responseJson['trip']['legs'][0],
            hidden4: true
          })
          //Alert.alert(JSON.stringify(responseJson));
        }else{
          Alert.alert("No se encontró ruta");
          this.setState({hidden4: true})
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Error de conexión')
        this.setState({hidden4: true})
      })
  }

  getRouteData(){
    this.setState({hidden4: false})
    const obj = this.state.pointCurrent;

    var destiny = {};
    if(obj['properties']['indoor'] == 'no'){
      coords = obj['properties']['roadPoint'].split(',').map(Number);
      destiny['latitude'] = coords[0];
      destiny['longitude'] = coords[1];
    }else{
      outdoorPoint = Outdoors.filter(point => point['properties']['name'] == obj['properties']['isin'])[0];
      coords = outdoorPoint['properties']['roadPoint'].split(',').map(Number);
      destiny['latitude'] = coords[0];
      destiny['longitude'] = coords[1];
    }

    console.log("La respuesta es: "+!(this.state.pointOrig['type']=='Feature'))
    if(!(this.state.pointOrig['type']=='Feature')){
      if (this.state.isPermissionGranted) {
        Geolocation.getCurrentPosition(
            (position) => {
                dataFetcher(position, destiny);
            },
            (error) => {
                navigator.geolocation.getCurrentPosition(
                  (position) => {dataFetcher(position, destiny)}, 
                  (error) => {Alert.alert("No se pudo obtener localización");this.setState({hidden4: true})}, 
                  {enableHighAccuracy: true, timeout: 20000, maximumAge: 80000});
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }else{
        Alert.alert("Se requieren permisos para acceder a la localización de usuario")
        this.setState({hidden4: true})
      }
    }else{
      const init = this.state.pointOrig;
      var origin = {'coords': {}};
      if(init['properties']['indoor'] == 'no'){
        coords = init['properties']['roadPoint'].split(',').map(Number);
        origin['coords']['latitude'] = coords[0];
        origin['coords']['longitude'] = coords[1];
      }else{
        outdoorPoint = Outdoors.filter(point => point['properties']['name'] == init['properties']['isin'])[0];
        coords = outdoorPoint['properties']['roadPoint'].split(',').map(Number);
        origin['coords']['latitude'] = coords[0];
        origin['coords']['longitude'] = coords[1];
      }
      dataFetcher(origin, destiny);
    }
    
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

  OptionSelect(option) {
    console.log(option);
    switch(option) {
      case 0:
        return {
                "type": "FeatureCollection",
                "generator": "JOSM",
                "features": []
               };
        break;
      case 1:
        return {
                "type": "FeatureCollection",
                "generator": "JOSM",
                "features": Labs
                };
        break;
      case 2:
        return {
                "type": "FeatureCollection",
                "generator": "JOSM",
                "features": Deps
                };
        break;
      case 3:
        return {
                "type": "FeatureCollection",
                "generator": "JOSM",
                "features": Canchas
                };
        break;
      case 4:
        return {
                "type": "FeatureCollection",
                "generator": "JOSM",
                "features": Parqs
                };
        break;
      default:
        return {
                "type": "FeatureCollection",
                "generator": "JOSM",
                "features": []
               };
    }
  }

  onSourceLayerPress(e) {
    const feature = e.nativeEvent.payload;
    console.log('You pressed a layer here is your feature', feature); // eslint-disable-line
    showMenu(feature);
  }

  RouteDescription(){
    const sw = this.state.route['hidden'] || false;
    if(sw){
      return <View></View>
    }else{
      return <View style={styles.routeDescContainer}>
        <Text style={{fontWeight: 'bold',textAlign: 'center'}}>GUIA</Text>
        <Text style={{fontWeight: 'bold',fontSize: 10}}>Aproximaciones:</Text>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4}}>
          <Text style={{fontSize: 12}}>Tiempo: {this.state.legs['summary']['time']} s</Text>
          <Text style={{fontSize: 12}}>Distancia: {this.state.legs['summary']['length']*1000} m</Text>
        </View>

        <Text style={{fontWeight: 'bold',fontSize: 10}}>Origen:</Text>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4}}>
          <Text style={{fontSize: 12}}>Ubicacion: {this.state.pointOrig['properties']['name'] || 'Error'}</Text>
          <Text style={{fontSize: 12}}>Piso: {this.state.pointOrig['properties']['level'] || 'N/A'}</Text>
        </View>
        
        <Text style={{fontWeight: 'bold',fontSize: 10}}>Indicaciones:</Text>
        <View key='I0' style={styles.routeStep}><Text style={{flex:8, fontSize: 12}}>Ubicate en el punto de partida de la ruta</Text><Text style={{flex:2, fontSize: 12}}> - </Text></View>
        {this.state.legs['maneuvers'].map((leg, i) => <View key={'I'+i} style={styles.routeStep}>
              <Text style={{flex:8, fontSize: 12}}>{leg['instruction']}</Text><Text style={{flex:2, fontSize: 12}}>{leg['length']*1000} m</Text>
            </View>)}
        {this.state.pointCurrent['properties']['indoor']=='yes'? <View key='IF' style={styles.routeStep}><Text style={{flex:8, fontSize: 12}}>Sigue la ruta interna del edificio hasta tu destino</Text><Text style={{flex:2, fontSize: 12}}> - </Text></View> : <View/>}
      </View>
    }
    
  }

  // Render

  render() {
    const slot = this.props.slot;
    const annotations = OptionSelect(slot);

    //const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    const query = this.state.query;
    const data = this.findData(query);
    //const rows = data.length === 1 && comp(query, data[0]['properties']['name']) ? [] : data.slice(0,5);
    const rows = data.slice(0,5);

    const oriquer = this.state.oriquer;
    const data2 = this.findData(oriquer);
    //var rows2 = data2.length === 1 && comp(oriquer, data2[0]['properties']['name']) ? [] : data2.slice(0,4);
    var rows2 = data2.slice(0,4);
    rows2 = rows2.length > 0? rows2.concat({'properties':{'name':'Tu posición'}}) : rows2;

    return (
      <View style={styles.container}>

        {/* Map Object */}
        <MapboxGL.MapView styleURL={'asset://style/bright.json'}
                        zoomLevel={16.1} 
                        centerCoordinate={[-74.8503,11.0191]}
                        style={styles.container}
                        minZoomLevel={16}
                        compassEnabled={false}
                        showUserLocation={this.state.isPermissionGranted}>

          <MapboxGL.ShapeSource id='outdoorSource' shape={General}>
            <MapboxGL.SymbolLayer id='majorPoints_iconsOnly' style={mb_styles.onlyIcons} filter={['has', 'name']} minZoomLevel={16.1} maxZoomLevel={17} />
            <MapboxGL.SymbolLayer id='majorPoints' style={mb_styles.majorPointers} filter={['has', 'name']} minZoomLevel={17} maxZoomLevel={18.5} />
          </MapboxGL.ShapeSource>

          <MapboxGL.ShapeSource id="indoorSource" shape={this.state.floorMap} >
            <MapboxGL.FillLayer id="rooms" style={mb_styles.buildings} filter={['==', 'building', 'university']} minZoomLevel={18.5}/>
            <MapboxGL.LineLayer id="roads" style={mb_styles.street} filter={['==', 'highway', 'footway']} minZoomLevel={18.5} />
            <MapboxGL.SymbolLayer id="points" style={mb_styles.pointers} filter={['has', 'name']} minZoomLevel={19}/>
            <MapboxGL.SymbolLayer id="points_iconsOnly" style={mb_styles.onlyIcons} filter={['has', 'name']} minZoomLevel={18.5} maxZoomLevel={19}/>
          </MapboxGL.ShapeSource>
          
          <MapboxGL.ShapeSource id='currentPointSource' shape={this.state.pointCurrent}>
            <MapboxGL.SymbolLayer id='selectionLayer' style={mb_styles.destinyIcon}/>
          </MapboxGL.ShapeSource>

          <MapboxGL.ShapeSource id='routeSource' shape={this.state.route}>
            <MapboxGL.LineLayer id='routeLayer' style={{lineColor:'red'}} />
          </MapboxGL.ShapeSource>

          <MapboxGL.ShapeSource id='selectionMarkers' shape={annotations} onPress={this.onSourceLayerPress}>
            <MapboxGL.SymbolLayer id='markerLayer' style={mb_styles.markerIcon} />
          </MapboxGL.ShapeSource>
        </MapboxGL.MapView>


        {/* Floating Input Object */}
        {//this.props.slot==0 &&
        <View style={styles.floatingInput}>
          <TouchableOpacity style={{flex: 1, alignItems: 'center'}} onPress={() => this.props.navigation.openDrawer()}>
            <Icon name='menu' />
          </TouchableOpacity>
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
                <TouchableOpacity onPress={() => selectedLocation(item)}>
                  <Text style={styles.itemText}>
                    {item['properties']['name']} (Piso: {item['properties']['level'] || 'N/A'})
                  </Text>
                </TouchableOpacity>
              )}
            />
            {!this.state.hidden3 && 
            <Autocomplete
              data={rows2} 
              defaultValue={oriquer}
              onChangeText={text => this.setState({ oriquer: text })}
              placeholder={"Origen: "+this.state.pointOrig['properties']['name']}
              keyExtractor={(item, index) => ("S2"+index)}
              containerStyle={{margin: 2}}
              inputContainerStyle={{borderWidth: 0, borderBottomWidth: 1, marginBottom: 1}}
              listStyle={{borderBottomWidth: 0}}
              renderItem={({item, index} ) => (
                <TouchableOpacity onPress={() => selectedOrigin(item)}>
                  <Text style={styles.itemText}>
                    {item['properties']['name']} (Piso: {item['properties']['level'] || 'N/A'})
                  </Text>
                </TouchableOpacity>
              )}
            />}
          </View>
        </View>
        }

        {/* Point Description and Menu */}
        {!this.state.hidden && 
        <ScrollView style={styles.floatingMenu}>
          
          <View style={styles.menuContent}>
            <Text style={{fontWeight: 'bold'}}>{this.state.pointCurrent['properties']['name'] || ""}</Text>
            {/* <Text style={{fontSize: 11}}>Piso: {this.state.pointCurrent['properties']['level']}</Text> */}
            <Text style={{fontSize: 11, paddingBottom:2}}>Piso: {this.state.pointCurrent['properties']['level'] || 'N/A'} | Otros nombres: {this.state.pointCurrent['properties']['alt_name'] || 'N/A'}</Text>
            
            <View style={styles.routeButtonWrapper}>
              <TouchableOpacity style={styles.routeButton} onPress={getRouteData}>
                <Text style={{fontSize: 10}}> TRAZAR RUTA </Text>
              </TouchableOpacity>
              <View style={styles.routeButtonWait}>
                {!this.state.hidden4 &&
                <Image style={{resizeMode: 'contain', height: 25}} source={require('../resources/loading.gif')}/>
                }
              </View>
            </View>
            
            <RouteDescription/>
            <Text>{this.state.pointCurrent['properties']['description']}</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={closeVis}>
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

        {/* <Button onPress={getRouteData}><Text>Get JSON</Text></Button> */}
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
      width: 10,
      height: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      borderRadius: 6,
    },
    annotationFill: {
      width: 13,
      height: 13,
      borderRadius: 6,
      backgroundColor: 'red',
      borderWidth: 2,
      borderColor: 'white',
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
    routeButton:{
      elevation: 1,
      borderRadius: 3,
      backgroundColor: '#a4c2f2',
      marginVertical: 5,
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    routeButtonWrapper:{
      flex: 1,
      flexDirection: 'row'
    },
    routeButtonWait: {
      flex: 2,
      
    },
    menuContent: {
      paddingVertical: 14,
      paddingHorizontal: 10,
    },
    floatingFloors: {
      position: 'absolute',
      backgroundColor: 'white',
      height: height/5,
      width: width/18,
      bottom: height/2-height/10,
      right: 5,
      borderRadius: 6,
      elevation: 3,
      padding: 2
    },
    floorButton: {
      backgroundColor: '#eaedf2',
      borderRadius: 3,
      marginVertical: 2,
    },
    autocompleteContainer: {
      borderWidth: 0
    },
    itemText: {
      margin: 2
    },
    routeDescContainer:{
      backgroundColor: '#e8e3b7',
      borderRadius: 3,
      flex: 1,
      flexDirection: 'column',
      marginVertical: 5,
      padding: 4
    },
    routeStep: {
      borderTopWidth:1, 
      borderStyle:'dashed',
      flex: 1, 
      flexDirection: 'row', 
      justifyContent: 'space-between',
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
    textSize: 10,
    textPadding: 1
  },
  majorPointers: {
    textField: MapboxGL.StyleSheet.identity('name'),
    textSize: 9,
    iconImage: 'marker_11',
    iconSize: 0.5,
    textOffset: [0,-1]
  },
  onlyIcons: {
    iconImage: 'marker_11',
    iconSize: 0.4
  },
  destinyIcon: {
    iconImage: StarIcon,
    iconSize: 0.3
  },
  markerIcon: {
    iconImage: ImageIcon,
    iconSize: MapboxGL.StyleSheet.camera({
      16: 0.1,
      18: 0.15
    }, MapboxGL.InterpolationMode.Exponential),
  }

});
