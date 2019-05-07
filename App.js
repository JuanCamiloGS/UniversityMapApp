/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, Image, View, SafeAreaView, ScrollView, Dimensions} from 'react-native';
import {createDrawerNavigator, DrawerItems} from 'react-navigation';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';

import {Labs, Deps, Canchas, Parqs} from './resources/floors.js'
import {General, Floors, POI, Outdoors} from './resources/floors.js'

var Wide = [General, Floors, POI, Outdoors];
var Specific = [Labs, Deps, Canchas, Parqs];

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <AppDrawerNavigator/>
    );
  }
}

const CustomDrawerComponent = (props) => (
  <SafeAreaView>
    <View style={{flexDirection: 'row', 
        backgroundColor: '#ccccb3',
        paddingVertical: 10,
        paddingHorizontal: 17,
        alignItems: 'center'
        }}>
      <Image style={{flex: 1, resizeMode: 'contain'}} source={require('./resources/headerlogo_un.png')} />
      
    </View>
    <Text style={{paddingVertical: 5, paddingLeft: 10, backgroundColor: '#f5f5f0'}}>Marcadores importantes:</Text>
    <View
      style={{
        paddingTop: 5,
        borderBottomColor: 'black',
        borderBottomWidth: 3,
      }}
    />
    <DrawerItems {...props} />
  </SafeAreaView>
  
)

const AppDrawerNavigator = createDrawerNavigator({
    Tú:{
      screen: props => <HomeScreen {...props} slot={0} wide={Wide} specific={Specific}/>
    },
    Laboratorios:{
      screen: props => <HomeScreen {...props} slot={1} wide={Wide} specific={Specific}/>
    },
    Bloques:{
      screen: props => <HomeScreen {...props} slot={2} wide={Wide} specific={Specific}/>
    },
    Canchas:{
      screen: props => <HomeScreen {...props} slot={3} wide={Wide} specific={Specific}/>
    },
    Parqueaderos:{
      screen: props => <HomeScreen {...props} slot={4} wide={Wide} specific={Specific}/>
    }
  },{
    contentComponent: CustomDrawerComponent
  }
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
