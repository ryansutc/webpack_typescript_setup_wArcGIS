//main.js
//var config = require('./config');
import "./config";
// Test ability to load module with jquery objects:
import other from './other';
other();
console.log("yo!");

//test ability to use fetch & promises in IE11:
import myfetchIds from './promise';
const url = "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Major_Cities/FeatureServer/0";
myfetchIds(url).then(function (ids: string[]) {
  console.log(ids.length);
  $("#fetchResult").text("Success. Got " + ids.length + " records");
})
  .catch(function (err: any) {
    $("#fetchResult").text("Error." + err);
  });

//test ability to create and open an ESRI arcGIS Javascript API map:
import EsriMap from "esri/Map";
import MapView from 'esri/views/MapView';
import FeatureLayer from 'esri/layers/FeatureLayer';
import "esri/layers/graphics/sources/support/MemorySourceWorker"; // as per suggestion here: https://github.com/g3r4n/jsapi-webpack/blob/featurelayer-demo/src/components/webmapview.js
const map = new EsriMap({
  basemap: "dark-gray"
});

const view = new MapView({
  container: "map",
  center: [-70.492, 59.657],
  zoom: 7,
  map: map
});

view.when(function () {
  // All the resources in the MapView and the map have loaded. Now execute additional processes
}, function (error: string) {
  // Use the errback function to handle when the view doesn't load properly
  console.log("The view's resources failed to load: ", error);
});

const myLayer = new FeatureLayer({
  url: url
});

map.add(myLayer);

myLayer.when(() => {
  view.extent = myLayer.fullExtent;
});

