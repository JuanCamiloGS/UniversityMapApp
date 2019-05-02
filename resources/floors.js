import General from './general.json';
import indoorMapS1 from './floorS1.json';
import indoorMap1 from './floor1.json';
import indoorMap2 from './floor2.json';

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
    }
]

export {Floors};
export {General};

var POI = [];
for (i = 0; i < Floors.length; i++) {
    FloorPoints = Floors[i]['map']['features'].filter(floor => floor['geometry']['type'] == 'Point');
    POI = POI.concat(FloorPoints);
} 

export {POI};