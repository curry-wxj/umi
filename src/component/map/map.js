import React from 'react';
import PropTypes from 'prop-types';
import { loadModules } from 'esri-loader';
import EsriLoader from 'esri-loader-react';
// nginx-kpgs中 
// arcgis学习网站
  // http://zhihu.esrichina.com.cn/article/556
  // http://support.esrichina.com.cn/
const DEFAULT_API_PATH = '/proxy8888/ecity_js_api1.0';
// 对应配置 在company\nginx-kpgs\static
function getCss() {
  return document.querySelector('link[data-esri-css]');
}
function dynamicCss(path) {
  if (!path || path.length === 0) {
    throw new Error('argument "path" is required !');
  }
  const head = document.getElementsByTagName('head')[0];
  const link = document.createElement('link');
  link.href = path;
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.setAttribute('data-esri-css', 'loaded');
  head.appendChild(link);
}

function loadingCss(api, esriVersion) {
  if (!getCss()) {
    dynamicCss(
      `${api}/frame/arcgis_js_api/library/${esriVersion}/${esriVersion}/dijit/themes/tundra/tundra.css`
    );
    dynamicCss(
      `${api}/frame/arcgis_js_api/library/${esriVersion}/${esriVersion}/esri/css/esri.css`
    );
  }
}

// 把 iframe 包在一个组建里，设 shouldComponentUpdate 为 false
class Map extends React.PureComponent {
  static propTypes = {
    mapcfg: PropTypes.shape({
      centerx: PropTypes.number,
      centery: PropTypes.number,
    }).isRequired,
    onMapLoad: PropTypes.func.isRequired,
    mapOptions: PropTypes.object,
    apiUrl: PropTypes.string,
    esriVersion: PropTypes.string,
  };

  static defaultProps = {
    mapOptions: {},
    apiUrl: DEFAULT_API_PATH,
    esriVersion: '3.20',
  };

  // 采用构造函数的方法解决不用页面同时调用地图组件产生id冲突问题
  constructor(props) {
    super(props);
    window._API_Path = props.apiUrl;
    const timeStample = new Date().getTime();
    this.mainMap = null;
    this.mapOper = null;
    this.mapDisplay = null;
    this.mapLayer = null;
    this.drawToolBar = null;
    this.mapDivId = `mapdiv_${timeStample}`;
    this.popupDivId = `popupdiv_${timeStample}`;

    this.state = {
      xPrefix: '',
      yPrefix: '',
      positionx: '',
      positiony: '',
    };

    this.options = {
      // url: 'https://js.arcgis.com/3.20/init.js',
      url: `${props.apiUrl}/frame/arcgis_js_api/library/${props.esriVersion}/${props.esriVersion}/init.js`,
      dojoConfig: {
        async: true,
        locale: 'zh-cn'
      },
    };
    this.loader = modules => loadModules(modules, this.options);
    loadingCss(props.apiUrl, props.esriVersion);
  }

  componentDidMount() {
    // window.require(["esri/map"], (EsriMap) => {
    //   const map = new EsriMap(this.mapDivId, {
    //     center: [-118, 34.5],
    //     zoom: 8,
    //     basemap: "topo"
    //   });
    //   console.log(map);
    // });
    const { mapcfg, mapOptions, onMapLoad } = this.props;
    this.loader([
      'esri/map',
      'custom/mapOper',
      'custom/mapLayer',
      'custom/mapDisplay',
      'custom/DrawToolBar',
      'custom/mapEvent',
      'esri/dijit/Popup',
      'dojo/dom-construct',
    ]).then(
      ([EsriMap, MapOper, MapLayer, MapDisplay, DrawToolBar, MapEvent, Popup, domConstruct]) => {
        const options = {
          autoResize: true,
          slider: false,
          infoWindow: new Popup(
            {
              marginLeft: 100,
              marginTop: 100,
            },
            this.popupDivId
          ),
        };
        if (mapcfg.minscale) {
          options.minScale = mapcfg.minScale;
        }
        if (mapcfg.maxscale) {
          options.maxScale = mapcfg.minScale;
        }

        this.map = new EsriMap(
          this.mapDivId,
          Object.assign(options, mapOptions || {}, {
            infoWindow: new Popup(
              {
                marginLeft: 100,
                marginTop: 100,
              },
              domConstruct.create('div')
            ),
          })
        );
        this.map.on('load', () => {
          this.onMapLoadHandle();
          onMapLoad(this);
        });

        this.mapOper = new MapOper(this.map);
        this.mapDisplay = new MapDisplay(this.map);
        this.mapLayer = new MapLayer(this.map);
        this.drawToolBar = new DrawToolBar(this.map, new MapEvent());

        this.addLayer();
      }
    );
  }

  componentWillUnmount() {
    if (this.map && typeof this.map.destroy === 'function') {
      this.map.destroy();
    }
  }

  onMapLoadHandle() {
    const { mapcfg } = this.props;

    this.loader(['esri/geometry/Extent', 'esri/geometry/Point']).then(([Extent, Point]) => {
      if (
        typeof mapcfg.centerx === 'number' &&
        typeof mapcfg.centery === 'number' &&
        mapcfg.centerx !== -1 &&
        mapcfg.centery !== -1
      ) {
        const point = new Point(mapcfg.centerx, mapcfg.centery, this.map.spatialReference);
        this.map.centerAt(point);
        if (typeof mapcfg.initlevel === 'number' && mapcfg.initlevel !== -1) {
          this.map.setZoom(mapcfg.initlevel);
        }
      } else if (mapcfg.extent) {
        if (
          typeof mapcfg.extent.xmin === 'number' &&
          typeof mapcfg.extent.xmax === 'number' &&
          typeof mapcfg.extent.ymin === 'number' &&
          typeof mapcfg.extent.ymax === 'number'
        ) {
          const extentJson = Object.assign(mapcfg.extent, {
            spatialReference: this.map.spatialReference,
          });
          const extent = new Extent(extentJson);
          this.map.setExtent(extent);
        }
      }
    });

    if (mapcfg.overview) {
      this.loader(['esri/dijit/OverviewMap'])
        .then(([OverviewMap]) => {
          const overview = new OverviewMap({
            map: this.map,
            visible: true,
            attachTo: 'bottom-left',
            width: 190, // 默认值是地图高度的 1/4th
            height: 150, // 默认值是地图高度的 1/4th
            opacity: 0.4, // 透明度 默认0.5
            maximizeButton: false, // 最大化,最小化按钮，默认false
            expandFactor: 3, // 概览地图和总览图上显示的程度矩形的大小之间的比例。默认值是2，这意味着概览地图将至少是两倍的大小的程度矩形。
            color: 'red', // 默认颜色为#000000
            showControl: true,
          });
          // 开启
          overview.startup();
        })
        .catch(err => console.error(err));
    }
    if (mapcfg.scale) {
      this.loader(['esri/dijit/Scalebar'])
        .then(([Scalebar]) => {
          const scalebar = new Scalebar({
            map: this.map, // 必须的
            scalebarStyle: 'line',
            scalebarUnit: 'metric', // 指定比例尺单位,有效值是'english(英制)' or 'metric（公制）'.默认'english'
            attachTo: 'bottom-left',
          });
          scalebar.show();
        })
        .catch(err => console.error(err));
    }
    if (mapcfg.position) {
      this.map.on('mouse-move', evt => {
        let xPrefix = 'x';
        let yPrefix = 'y';
        if (mapcfg.positionPrefix) {
          if (mapcfg.positionPrefix.x) {
            xPrefix = mapcfg.positionPrefix.x;
          }
          if (mapcfg.positionPrefix.y) {
            yPrefix = mapcfg.positionPrefix.y;
          }
        }
        const px = evt.mapPoint.x.toString();
        const py = evt.mapPoint.y.toString();
        const xdotIndex = px.indexOf('.');
        const ydotIndex = py.indexOf('.');
        // 保留小数点后四位
        this.setState({
          xPrefix,
          yPrefix,
          positionx: px.substring(0, xdotIndex + 5),
          positiony: py.substring(0, ydotIndex + 5),
        });
      });
    }
  }

  addLayer() {
    const { mapcfg } = this.props;
    // 2015-01-22 重构地图加载 by re
    const baseLayerInfoArr = mapcfg.map_base;
    const layerArr = [];
    baseLayerInfoArr.forEach(group => {
      if (group.visible === 1) {
        group.maps.forEach(layer => {
          layer.visible = group.visible;
          layer.group = group.group;
          delete layer.params;
          layerArr.push({
            type: layer.type,
            options: layer,
          });
        });
      }
    });
    const netLayerInfo = mapcfg.map_net;
    if (Array.isArray(netLayerInfo)) {
      netLayerInfo.forEach(group => {
        if (group.visible === 1) {
          group.maps.forEach(layer => {
            layer.visible = group.visible;
            layer.group = group.group;
            layerArr.push({
              type: layer.type,
              options: layer,
            });
          });
        }
      });
    }

    if (layerArr.length !== 0) {
      this.mapLayer.appendMultipleMap(layerArr, esriLayerArr => {
        for (let i = 0; i < esriLayerArr.layers.length; i += 1) {
          const lay = esriLayerArr.layers[i].layer;
          const err = esriLayerArr.layers[i].error;
          if (lay.group.split('_')[0] === 'n') {
            if (!err) {
              lay.getNode().style.zIndex = 1;
            }
          }
        }
      });
    }
  }

  require(modules) {
    let modulesPath = [];
    if (Array.isArray(modules)) {
      modulesPath = modules.map(path => {
        let tmp = path;
        if (path.indexOf('esri') === -1) {
          tmp = `esri/${tmp}`;
        }
        return tmp;
      });
    } else {
      modulesPath = modules.indexOf('esri') === -1 ? [`esri/${modules}`] : [modules];
    }
    return loadModules(modulesPath.map(path => path.replace(/\/\//g, '/')), this.options).then(
      arr => {
        if (arr.length === 1) {
          return arr[0];
        }
        return arr;
      }
    );
  }

  render() {
    const { mapcfg: { position } } = this.props;
    const { xPrefix, positionx, yPrefix, positiony } = this.state;
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <EsriLoader options={this.options} ready={() => console.timeEnd('JSAPI loaded')} />
        <div id={this.mapDivId} style={{ width: '100%', height: '100%' }} />
        <div id={this.popupDivId} />
        {position && (
          <div
            style={{
              position: 'absolute',
              zIndex: 30,
              left: 25,
              bottom: 5,
              backgroundColor: 'white',
            }}
          >
            <span style={{ fontSize: '12px', fontFamily: 'Arial', fontWeight: 'bold' }}>
              <b>{xPrefix}:</b>
              <b>{positionx}</b>
              <br />
              <b>{yPrefix}:</b>
              <b>{positiony}</b>
              <br />
            </span>
          </div>
        )}
      </div>
    );
  }
}

export default Map;
