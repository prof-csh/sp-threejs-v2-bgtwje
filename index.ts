/*
export const THREE_JS_DEPS = [
    {'name':'three.min', 'type': 'js', 'src':require('file-loader?name=threejs-[name]-[hash].[ext]!three/build/three.min.js')},
    {'name':'ColladaLoader', 'type': 'js', 'src':require('file-loader?name=threejs-[name]-[hash].[ext]!three/examples/js/loaders/ColladaLoader.js')},
    {'name':'MTLLoader', 'type': 'js', 'src':require('file-loader?name=threejs-[name]-[hash].[ext]!three/examples/js/loaders/MTLLoader.js')},
    {'name':'OBJLoader', 'type': 'js', 'src':require('file-loader?name=threejs-[name]-[hash].[ext]!three/examples/js/loaders/OBJLoader.js')},
    {'name':'DDSLoader', 'type': 'js', 'src':require('file-loader?name=threejs-[name]-[hash].[ext]!three/examples/js/loaders/DDSLoader.js')},
    {'name':'OrbitControls', 'type': 'js', 'src':require('file-loader?name=threejs-[name]-[hash].[ext]!three/examples/js/controls/OrbitControls.js')}
];
*/

// Import stylesheets
import './style.scss';
import { ThreeJsPresentationRenderer } from "./ThreeJsPresentationRenderer";
const viewHTMLElement: HTMLElement = document.getElementById('view');

const assetViewerViews = [];

assetViewerViews.push({
  assetViewerItem: {
    code: 'fighter-png',
    displayName: 'fighter.zip',
    type: '3d-model',
    previewUrl: 'https://s3.eu-central-1.amazonaws.com/vlakken/assets/3d-model/fighter/preview.jpg',
    presentations: [
      {
        type: 'manifest',
        urls: [
          'https://s3.eu-central-1.amazonaws.com/vlakken/assets/3d-model/fighter/manifest.json'
        ]
      }
    ],
    extension: 'zip'
  }
});

assetViewerViews.push({
  assetViewerItem: {
    code: 'agrostar-tga',
    displayName: 'agrostar.zip',
    type: '3d-model',
    previewUrl: 'https://s3.eu-central-1.amazonaws.com/vlakken/assets/3d-model/agrostar/preview.jpg',
    presentations: [
      {
        type: 'manifest',
        urls: [
          'https://s3.eu-central-1.amazonaws.com/vlakken/assets/3d-model/agrostar/manifest.json'
        ]
      }
    ],
    extension: 'zip'
  }
});

assetViewerViews.push({
  assetViewerItem: {
    code: 'spitfire-tga',
    displayName: 'spitfire.zip',
    type: '3d-model',
    previewUrl: 'https://s3.eu-central-1.amazonaws.com/vlakken/assets/3d-model/DAE/spitfire/preview.png',
    presentations: [
      {
        type: 'manifest',
        urls: [
          'https://s3.eu-central-1.amazonaws.com/vlakken/assets/3d-model/DAE/spitfire/manifest.json'
        ]
      }
    ],
    extension: 'zip'
  }
});

const uri = window.location.href;
var queryString = {};
uri.replace(
    new RegExp("([^?=&]+)(=([^&]*))?", "g"),
    function($0, $1, $2, $3) { queryString[$1] = $3; }
);

const codes = assetViewerViews.map(item=>item.assetViewerItem.code);
const code = queryString['code'] || codes[0];
const guiConfig = {code}
const gui = new dat.GUI();
gui.add(guiConfig, 'code', codes).onChange(()=>{window.location.href = '/?code='+guiConfig.code});

const assetViewerView = assetViewerViews.find(item=>item.assetViewerItem.code === code);
const threeJsPresentationRenderer = new ThreeJsPresentationRenderer(assetViewerView, assetViewerView.assetViewerItem.presentations[0]);
threeJsPresentationRenderer
  .load()
  .then(()=>threeJsPresentationRenderer.render(viewHTMLElement))
  .then(()=>{});