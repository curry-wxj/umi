/**
 * icon: printer
 * authority: admin
 */
import React, { Component } from 'react';
// import axios from 'axios';
// import fetch from 'dva/fetch';
import qs from 'qs';
import Map from '@/component/map';
import { getCfgByKey } from '@/utils/sysConfig';

// const instance = axios.create({
//   baseURL: 'https://operation.callai.net/callai-operation',
//   timeout: 30000,
//   withCredentials: true,
// })
const mapcfg = getCfgByKey('mapcfg');
export default class Demo extends Component {
  componentDidMount (){

    // axios({
    //   url: `/proxy809/admin/login`,
    //   method: 'post',
    //   data: qs.stringify({
    //     username: 'qiying-mx01',
    //     password: 'caWlp5aW5nbXg4ODA4',
    //   }),
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   }
    // }).then(res=>{

    //   console.log(res)
    // })
    // const res2 = await axios({
    //   url: `/proxy809/admin/pushConf/disposeConf?sessionid=${res1}`,
    //   method: 'post',
    //   data: qs.stringify({
    //     isOn: 0,
    //     pushType: 2,
    //     pushAddr: 'http://192.168.90.128:8000/insert'
    //   }),
    //   // transformRequest: [(data) => {
    //   //   console.log(data);
    //   //   return qs.stringify(data)
    //   // }],
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   }
    // })
    // console.log(res2);
    fetch('/proxy809/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify({
        username: 'qiying-mx01',
        password: 'caWlp5aW5nbXg4ODA4',
      })
    }).then((response) => {
      console.log(response.json())
      // handle HTTP response
    })
  }

  onMapLoadHandler = () => {
    // mapWnd.require([
    //   '/layers/ArcGISDynamicMapServiceLayer',
    //   'layers/ArcGISImageServiceLayer'
    // ]).then(([
    //   ArcGISDynamicMapServiceLayer,
    //   ArcGISImageServiceLayer
    // ]) => {
    //   console.log(ArcGISDynamicMapServiceLayer);
    //   console.log(ArcGISImageServiceLayer);
    //   mapWnd.mapDisplay.image({
    //     id: 'text-gif',
    //     layerId: 'layer-gif',
    //     src: 'http://192.168.8.173:8085/ecity_js_api1.0/images/loading.gif',
    //     width: 20,
    //     height: 20,
    //     x: 56643,
    //     y: 45203,
    //   });
    //   mapWnd.mapDisplay.image({
    //     id: 'text-gif-2',
    //     layerId: 'layer-gif',
    //     src: 'http://192.168.8.173:8085/ecity_js_api1.0/images/loading.gif',
    //     width: 40,
    //     height: 40,
    //     x: 64114,
    //     y: 36707,
    //   });
    // });
  }

  onMapLoad = mapWnd => {
    this.mapWnd = mapWnd;
  };

  render() {
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
        }}
      >
        <Map
          mapcfg={mapcfg}
          onMapLoad={this.onMapLoad}
          style={{
            height: 'calc(100% - 60px)',
            width: '100%',
            marginTop: '-16px',
          }}
        />
      </div>
    );
  }
};