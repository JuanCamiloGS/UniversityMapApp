import General from './general.json';
import indoorMapS1 from './floorS1.json';
import indoorMap1 from './floor1.json';
import indoorMap2 from './floor2.json';
import indoorMap3 from './floor3.json';

var Floors = [
    {
        'map': indoorMapS1,
        'label': -1
    },
    {
        'map': indoorMap1,
        'label': 1
    },
    {
        'map': indoorMap2,
        'label': 2
    },
    {
        'map': indoorMap3,
        'label': 3
    }
]

export {Floors};
export {General};

var POI = [];
for (i = 0; i < Floors.length; i++) {
    FloorPoints = Floors[i]['map']['features'].filter(floor => floor['geometry']['type'] == 'Point');
    POI = POI.concat(FloorPoints);
} 
POI = POI.concat(General['features'].filter(floor => floor['geometry']['type'] == 'Point'));

var Outdoors = [];
//Cambiar General a POI cuando termine de probar
Outdoors = Outdoors.concat(General['features'].filter(point => point['properties']['indoor'] == "no"));

var Labs = [];
Labs = Labs.concat(POI.filter(point => point['properties']['unitype'] == "1"));

var Deps = [];
Deps = Deps.concat(POI.filter(point => point['properties']['unitype'] == "2"));

var Canchas = [];
Canchas = Canchas.concat(POI.filter(point => point['properties']['unitype'] == "3"));

var Parqs = [];
Parqs = Parqs.concat(POI.filter(point => point['properties']['unitype'] == "4"));

//Esto puede mejorarse:

Repeat = POI.filter(point => point['properties'].hasOwnProperty("alt_name"));
Repeat.forEach(function(orig){
    entry = JSON.parse(JSON.stringify(orig));
    [entry['properties']['name'], entry['properties']['alt_name']] = [entry['properties']['alt_name'], entry['properties']['name']];
    POI.push(entry);
});

//

export {POI};
export {Outdoors};
export {Labs};
export {Deps};
export {Canchas};
export {Parqs};