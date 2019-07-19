import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {Header, Icon, Left, Button} from 'native-base'

class Settings extends Component {
  
  render() {
    return (        
      <ScrollView stickyHeaderIndices={[0]}>
        {
          <View>
            <View style={styles.return}>
              <TouchableOpacity style={{flex: 1, alignItems: 'center'}} onPress={() => this.props.navigation.openDrawer()}>
                <Icon name='menu' />
              </TouchableOpacity>
              <View style={{flex: 4, borderLeftWidth: 2, borderLeftColor: 'black'}}>
                <Text style={{padding:15, textAlign: 'center', fontSize: 16}}>INSTRUCCIONES DE USO</Text>
              </View>
            </View>
          </View>
        }
        {
          <View style={styles.container}>
            <Text style={styles.title}>¡Bienvenido!</Text>
            <Text style={styles.paragraph}>Esta es una aplicación para poder guiarte dentro de la Universidad del Norte. 
                Podrás encontrar lugares especificos dentro del campus y trazar una ruta hasta ellos. También puedes visualizar el mapa 
                y descubrir sitios nuevos, incluso pudiendo ver el interior de los bloques y edificaciones.
            </Text>
            <Text style={styles.paragraph}>Moverte en a través del mapa es muy similar a otras aplicaciones de localización. 
                Si lo que deseas es ver el interior de algún edificio, solo tienes que aumentar el acercamiento y podrás ver su estructura interna.
                Ahí podrás ver detalladamente los salones, oficinas y demás puntos de interés en el edificio así como las rutas internas que puedes
                seguir para llegar a ellos.
            </Text>
            <Text style={styles.paragraph}>Si deseas encontrar algún lugar en especifico, puedes hacer uso del buscador ubicado en la parte superior
                de la pantalla principal. A medida que escribas el nombre del lugar que buscas, se mostraran en pantalla sugerencias similares
                a lo que has digitado. Deberás presionar la opción que estás buscando.
            </Text>
            <Text style={styles.paragraph}>Una vez hayas seleccionado el punto de interés, verás como aparece un cuadro informativo en la parte inferior de la pantalla
                en donde encontrarás el nombre del lugar y una breve descripción entre otros datos. En este cuadro verás también un botón azul que trazará una ruta
                desde tu ubicación hasta el lugar que hayas seleccionado. En la parte superior de la pantalla, bajo el buscador principal, 
                verás un buscador secundario que te permitirá seleccionar un punto de origen distinto a tu ubicación. Es importante que tengas una buena conexión
                a internet para obtener la ruta.
            </Text>
            <Text style={styles.paragraph}>Cuando se haya dibujado la ruta sobre el mapa, verás que en el cuadro informativo se añade información del trayecto a seguir
                para llegar a tu destino. Aquí se muestran indicaciones a seguir durante la ruta y aproximaciones de cuanto tiempo y distancia te separan del punto seleccionado.
            </Text>
            <Text style={styles.paragraph}>Finalmente, otra manera de localizar puntos de interés dentro del campus universitario es usando la localización
                por categorías. Al presionar el botón de menú o deslizando el dedo desde el extremo izquierdo de la pantalla, desplegarás un menú con distintas
                categorías que agrupan puntos de interés: laboratorios, bloques, canchas y parqueaderos.
            </Text>
            <Text style={styles.paragraph}>Al seleccionar alguna de las categorías, serás enviado a una vista del mapa en la que verás iconos rojos ubicados en los puntos
                de interés correspondientes a esa categoría. Si presionas sobre los iconos rojos, verás como aparece el cuadro informativo del lugar seleccionado.
                Este cuadro es el mismo que aparece al seleccionar el lugar utilizando el buscador, como se mencionó anteriormente.
            </Text>
            <Text style={styles.paragraph}>Esperamos que esta información te haya sido útil y que no vuelvas a perderte más dentro de la universidad utilizando
                esta aplicación.
            </Text>
          </View>
        }
      </ScrollView>
    );
  }
}

export default Settings;

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title:{
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 24,
      padding: 10
    },
    paragraph: {
      textAlign: 'justify',
      paddingHorizontal: 10,
      paddingVertical: 10,
      fontSize: 15
    },
    return: {
      backgroundColor: '#ccccb3',
      elevation: 3,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center'
    }
})