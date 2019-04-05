import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';

Mapbox.setAccessToken('pk.eyJ1IjoianVhbmNhbWlsb2dzIiwiYSI6ImNqczFtZTAzNTF2dm80NHBkcjNtZnV4d28ifQ.O1btLai2y5Q0YR0PBWRV-w');

let featuresObject = [
  {type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [-74.8509, 11.0184]
    }
  },
  {type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [-74.8501, 11.0181]
    }
  },
  {type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [-74.8507, 11.0189]
    }
  },
  {type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [-74.8508, 11.0187]
    }
  },
]

class Home extends Component<{}> {
  
  renderAnnotations () {
    return (
      <View>
        <Mapbox.PointAnnotation
          key='pointAnnotation'
          id='pointAnnotation'
          coordinate={[-74.8508, 11.0187]}>

          <View style={styles.annotationContainer}>
            <View style={styles.annotationFill} />
          </View>
          <Mapbox.Callout title='Laboratorio 1' />
        </Mapbox.PointAnnotation>

        <Mapbox.PointAnnotation
          key='pointAnnotation2'
          id='pointAnnotation2'
          coordinate={[-74.8507, 11.0189]}>

          <View style={styles.annotationContainer}>
            <View style={styles.annotationFill} />
          </View>
          <Mapbox.Callout title={this.props.slot} />
        </Mapbox.PointAnnotation>
      </View>
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


var labs = 
  <View>
    <Mapbox.PointAnnotation
      key='pointAnnotation'
      id='pointAnnotation'
      coordinate={[-74.8508, 11.0187]}>

      <View style={styles.annotationContainer}>
        <View style={styles.annotationFill} />
      </View>
      <Mapbox.Callout title='Laboratorio 1' />
    </Mapbox.PointAnnotation>

    <Mapbox.PointAnnotation
      key='pointAnnotation2'
      id='pointAnnotation2'
      coordinate={[-74.8507, 11.0189]}>

      <View style={styles.annotationContainer}>
        <View style={styles.annotationFill} />
      </View>
      <Mapbox.Callout title={"Lab 2"} />
    </Mapbox.PointAnnotation>
  </View>;

var coors = 
  <View>
    <Mapbox.PointAnnotation
      key='pointAnnotation'
      id='pointAnnotation'
      coordinate={[-74.8508, 11.0187]}>

      <View style={styles.annotationContainer}>
        <View style={styles.annotationFill} />
      </View>
      <Mapbox.Callout title='Look! An annotation!' />
    </Mapbox.PointAnnotation>

    <Mapbox.PointAnnotation
      key='pointAnnotation2'
      id='pointAnnotation2'
      coordinate={[-74.8507, 11.0189]}>

      <View style={styles.annotationContainer}>
        <View style={styles.annotationFill} />
      </View>
      <Mapbox.Callout title='Look! An annotation!' />
    </Mapbox.PointAnnotation>
  </View>;
