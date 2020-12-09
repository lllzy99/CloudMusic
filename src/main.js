import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'lib-flexible/flexible'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store'
Vue.use(VueAxios, axios)

import {
  Icon,
  Swipe,
  SwipeItem,
  Slider,
  NavBar,
  Circle,
  Popup,
  Collapse,
  CollapseItem,
  Toast,
  Search,
  List,
  Tab,
  Tabs,
  Cell,
  CellGroup,
  Tabbar,
  TabbarItem,
  Empty
} from 'vant';


Vue
  .use(Icon)
  .use(Swipe)
  .use(SwipeItem)
  .use(Slider)
  .use(NavBar)
  .use(Circle)
  .use(Popup)
  .use(Collapse)
  .use(CollapseItem)
  .use(Toast)
  .use(Search)
  .use(List)
  .use(Tab)
  .use(Tabs)
  .use(Cell)
  .use(CellGroup)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Empty)

// 配置请求基础路径
axios.defaults.baseURL = 'http://localhost:3000'


// 格式化播放次数
Vue.filter('Format',(v,n) => {
  try{
    n = n || 1;
    if(v > 100000000){
      return (v/100000000).toFixed(n)+'亿';
    }else if(v >= 10000){
      return (v/10000).toFixed(n)+'万';
    }else{
      return v;
    }
  }catch(e){
    return 0;
  }
})


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
