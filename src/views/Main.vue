<template>
  <div class="main">
    <div class="main-top clearfix">
      <div class="fl icon icon-left" @click="showMy">
        <van-icon name="wap-nav" size="20px" />
      </div>
      <div class="fr icon icon-right" @click="goPage('Search')">
        <van-icon name="search" size="20px" />
      </div>
      <div class="topbar">
        <div><router-link :to="{name:'List'}">歌单</router-link></div>
        <div><router-link :to="{name:'Find'}">发现</router-link></div>
        <div><router-link :to="{name:'Rank'}">排行榜</router-link></div>
      </div>
    </div>

    <!-- 我的弹出层 -->
    <van-popup v-model="showmyPopup" round position="left" :style="{ width: 'calc(80% - 20px)', height:'100%'}">
      <div class="my-top">
        <div>手机电脑多端同步，尽享海量高品质音乐</div>
        <div class="login-btn">立即登录</div>
      </div>
      <div class="tabbar">
        <van-tabbar active-color="#e6d68b" inactive-color="#e6d68b">
          <van-tabbar-item v-for="(item,index) in tabbarData" :key="index" :icon="item.icon">{{item.title}}</van-tabbar-item>
        </van-tabbar>
      </div>
      <div class="cell-box">
        <van-cell class="cell-item" value="内容" color="#fff" :icon="item.icon" v-for="(item,index) in myData" :key="index"  @click="goPage(item.name)">{{item.title}}</van-cell>
      </div>
    </van-popup>

    <!-- 二级路由 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    
  </div>
</template>

<script>
import '../assets/less/my.less'
export default {
  name: 'Main',

  data(){
    return{
      showmyPopup:false,

      tabbarData: [
        {title: '我的消息', icon: 'envelop-o'},
        {title: '我的好友', icon: 'friends-o'},
        {title: '个人主页', icon: 'wap-home-o'},
        {title: '个性装扮', icon: 'point-gift-o'}
      ],

      myData: [
        {title: '喜欢的音乐',icon: 'like-o',name: 'Like'},
        {title: '听歌历史', icon: 'music-o', name: 'History'},
        {title: '收藏歌单', icon: 'orders-o', name: 'Likelist'}
      ]

    }
  },

  methods: {
    goPage(name){
      this.$router.push({name});
    },
    showMy(){
      this.showmyPopup = true;
    },

  }
}
</script>


