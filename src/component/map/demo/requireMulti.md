---
order: 4
title:
  zh-CN: 动态加载多个组件
  en-US: requireMulti
---

## zh-CN

动态组件加载，支持 [arcgis 官网模块](https://developers.arcgis.com/javascript/3/jsapi/map-amd.html)，需忽略 esri 前缀

``` jsx
import { Map } from 'yd';

const mapcfg = {
  "centerx": -1,
  "centery": -1,
  "initlevel": -1,
  "extent": {
    "xmin": 38898,
    "xmax": 65822,
    "ymin": 38375,
    "ymax": 49364
  },
  "isJwd": 0,
  "overview": 0,
  "scale": 0,
  "position": 1,
  "positionPrefix": {
    "x": "x",
    "y": "y"
  },
  "map_base": [{
    "group": "m_1",
    "visible": 1,
    "maps": [{
      "id": "base_dxt",
      "url": "http://192.168.8.135:8087/ServiceEngine/rest/services/DZDT/MapServer",
      "type": "tiled",
      "name": "电子地图",
      "params": {
        "imgurl": "/images/legend/layerBtn/dxt.png",
        "legendurl": "/images/legend/layerBtn/dxt.png",
        "maxscale": "",
        "minscale": ""
      }
    }]
  }],
  "map_net": [{
    "group": "n_1",
    "visible": 1,
    "maps": [{
      "id": "net_hpjs",
      "url": "http://192.168.8.135:8087/ServiceEngine/rest/services/DX_SL/MapServer",
      "type": "tiled",
      "name": "苏州地形矢量",
      "params": {
        "maxscale": "5",
        "minscale": "400",
        "snapLayers": "",
        "layersName": []
      }
    }]
  }],
  "map_thematic": [{
    "group": "t_1",
    "visible": 1,
    "maps": [{
      "id": "thematic_ds",
      "url": "http://192.168.8.173:6080/arcgis/rest/services/hpzh/hpdsdd/MapServer",
      "type": "tiled",
      "name": "有线",
      "params": {
        "legendurl": "/module/layerShowManager/images/legend_wsgw.png"
      }
    }]
  }]
}

function onMapLoadHandler(mapWnd) {
  
  mapWnd.require([
    '/layers/ArcGISDynamicMapServiceLayer', 
    'layers/ArcGISImageServiceLayer'
  ]).then(([
    ArcGISDynamicMapServiceLayer, 
    ArcGISImageServiceLayer
  ]) => {
    console.log(ArcGISDynamicMapServiceLayer);
    console.log(ArcGISImageServiceLayer);
    mapWnd.mapDisplay.image({
      id: 'text-gif',
      layerId: 'layer-gif',
      src: 'http://192.168.8.173:8085/ecity_js_api1.0/images/loading.gif',
      width: 20,
      height: 20,
      x: 56643,
      y: 45203,
    });
    mapWnd.mapDisplay.image({
      id: 'text-gif-2',
      layerId: 'layer-gif',
      src: 'http://192.168.8.173:8085/ecity_js_api1.0/images/loading.gif',
      width: 40,
      height: 40,
      x: 64114,
      y: 36707,
    });
  });
}

ReactDOM.render((
  <Map mapcfg={mapcfg} onMapLoad={onMapLoadHandler} apiUrl="http://192.168.8.173:8085/ecity_js_api1.0" />
), mountNode)
```
