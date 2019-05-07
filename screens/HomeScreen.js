import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, TouchableOpacity, ScrollView, TextInput, Keyboard} from 'react-native';
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
      pointCurrent: {
        "type": "Point",
        "coordinates": [0,0],
        "hidden": true,
        "properties": {}
      },
      floorMap: Floors[1].map,
      currentFloor: 1,
      route: {
        "type": "LineString",
        "coordinates": []
      },
      query: ''
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
      pointCurrent: {
        "type": "Point",
        "coordinates": [0,0
        ],
        "properties": {}
      }
    });

  }

  findData(query) {
    if (query === '') {
      return [];
    }
    const regex = new RegExp(`${query.trim()}`, 'i');
    return POI.filter(point => point['properties']['name'].search(regex) >= 0);
  }

  selectedLocation(obj){
    this.setState({ query: obj['properties']['name']}); 
    showMenu(obj);
    Keyboard.dismiss();
  }

  // Información Indoors

  changeFloor(props){
    this.setState({
      floorMap: props.map,
      currentFloor: props.floor
    })
  }

  getRouteData(){
    const obj = this.state.pointCurrent;
    var destiny = {};
    if(obj['properties']['indoor'] == 'no'){
      coords = obj['properties']['roadPoint'].split(',').map(Number);
      destiny['latitude'] = coords[0];
      destiny['longitude'] = coords[1];
    }else{
      outdoorPoint = Outdoors.filter(point => point['properties']['name'] == obj['properties']['isin'])[0];
      //console.log(Outdoors);
      coords = outdoorPoint['properties']['roadPoint'].split(',').map(Number);
      destiny['latitude'] = coords[0];
      destiny['longitude'] = coords[1];
    }
    if (this.state.isPermissionGranted) {
      Geolocation.getCurrentPosition(
          (position) => {
              console.log(position);
          },
          (error) => {
              // See error code charts below.
              console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );

      fetch('http://159.89.22.204:8002/route', {
      method: 'POST', 
      body: JSON.stringify(
        {
          "locations": [
            {
              "lat": dummy['coords']['latitude'],
              "lon": dummy['coords']['longitude'],
              "type": "break"
            },
            {
              "lat": destiny['latitude'],
              "lon": destiny['longitude'],
              "type": "break"
            },
          ],
          "costing":"pedestrian",
          "directions_options":{"units":"metres"}
        }
      )})
      //'{"locations":[{"lat":11.019573,"lon":-74.849811,"type":"break"},{"lat":11.019805,"lon":-74.850563,"type":"break"}],"costing":"pedestrian","directions_options":{"units":"metres"}}'})
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          route: polyline.toGeoJSON(responseJson['trip']['legs'][0]['shape'],6)
        })
        console.log(responseJson);
        
      })
      .catch((error) => {
        console.error(error);
      });
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

  MapboxPoint(props){
    const obj = props.obj;
    return  <MapboxGL.PointAnnotation
              id={'P'+obj['properties']['name']}
              coordinate={[obj['geometry']['coordinates'][0], obj['geometry']['coordinates'][1]]}>
              <TouchableOpacity style={styles.annotationFill} onPress={this.showMenu.bind(this,obj)}>
                {/* <View style={styles.annotationFill}  /> */}
              </TouchableOpacity>
            </MapboxGL.PointAnnotation>;
  }

  OptionSelect2(props) {
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

  OptionSelect(option) {
    //const option = props.slotChoice;
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

  renderAnnotations () {
    return (
      <OptionSelect slotChoice={this.props.slot}/>
    )
  }

  onSourceLayerPress(e) {
    const feature = e.nativeEvent.payload;
    console.log('You pressed a layer here is your feature', feature); // eslint-disable-line
    showMenu(feature);
  }

  // Render

  render() {
    const slot = this.props.slot;
    const annotations = OptionSelect(slot);

    const query = this.state.query;
    const data = this.findData(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    const rows = data.length === 1 && comp(query, data[0]['properties']['name']) ? [] : data.slice(0,5);

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
          {/* {this.renderAnnotations()} */}
          

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
        {this.props.slot==0 &&
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
            
            <TouchableOpacity style={styles.routeButton} onPress={getRouteData}>
              <Text style={{fontSize: 10, textAlign: 'center'}}> TRAZAR RUTA </Text>
            </TouchableOpacity>

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
      width: width/4
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
    iconSize: 0.4
  },
  markerIcon: {
    iconImage: ImageIcon,
    iconSize: MapboxGL.StyleSheet.camera({
      16: 0.12,
      18: 0.22
    }, MapboxGL.InterpolationMode.Exponential),
  }

});
