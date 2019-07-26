var menu = [
  {
    path: '/heihei',
    icon: 'printer',
    image: '/images/menu/分区管理.png',
    children: [{
      path: '/heihei/demo1',
      authority: 'admin',
    }, {
      path: '/heihei/demo2',
      authority: 'admin',
    }, {
      path: '/heihei/demo2/wxj',
      authority: 'admin',
    },{
      path: '/heihei/demo1/a',
      authority: 'admin',
    },{
      path: '/heihei/demo1/b',
      authority: 'admin',
    }],
  },
  {
    path: '/list',
    icon: 'shake',
    image: '/images/menu/在线监测.png',
    children: [],
  },
  {
    path: '/hello',
    icon: 'exception',
    image: '/images/menu/系统管理.png',
    children: [{
      path: '/hello/helloworld',
    }, {
      path: '/hello/hellowxj',
      authority: 'admin',
    }],
  },
]