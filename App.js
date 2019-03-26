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
import SettingsScreen from './screens/SettingsScreen'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

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
    <Text style={{paddingVertical: 5, paddingLeft: 10, backgroundColor: '#f5f5f0'}}>Marcar en mapa:</Text>
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
  Home:{screen: HomeScreen},
  Settings:{screen: (props) => <SettingsScreen {...props.navigation.state.params} propName={"Original"} />},
  Alternate:{screen: (props) => <SettingsScreen {...props.navigation.state.params} propName={"Alternate"} />}
},{
  contentComponent: CustomDrawerComponent
})

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
