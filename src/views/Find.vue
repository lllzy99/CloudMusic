<template>
  <div class="find">
    <!-- 轮播图 -->
    <div class="banner-box">
      <Banner :bannerInfo="bannerInfo"></Banner>
    </div>
    <!-- 栏目板块 -->
    <div class="navbar-box">
      <div class="navbar-item" v-for="(item,index) in iconData" :key="index" @click="goCircle(item.go)">
        <div class="icon-item">
          <img class="auto-img" :src="item.iconUrl" alt="">
        </div>
        <div class="title-text">{{item.name}}</div>
      </div>
    </div>
    <!-- 推荐 -->
    <div class="recommend-box">
      <div class="recommend-title clearfix">
        <div class="fl">推荐歌单</div>
      </div>
      <div class="recommend-content">
        <ul class="clearfix">
          <li class="recommend-item fl" v-for="(item,index) in recommendData" :key="index" @click="selectRecommendId(item)">
            <div class="img-box">
              <img class="auto-img" :src="item.picUrl">
              <div class="playCount">
                <div class="icon">
                  <img class="auto-img" src="../assets/images/play_icon.png" >
                </div>
                <div class="count">{{item.playCount | Format}}</div>
              </div>
            </div>
            <div class="desc">
              <div>{{item.name}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 最新音乐 -->
    <div class="find-content">
      <div class="newlist">
        <div class="newlist-top clearfix">
          <div class="fl">最新音乐</div>
          <div class="fr">...</div>
        </div>
        <div class="newlist-content">
          <SongList :newsongs="newSongData" @getItem="getAudioItem"></SongList>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import '../assets/less/find.less'
  import Banner from '../components/Banner.vue'
  import SongList from '../components/SongList.vue'
  import {sliceArray} from '../assets/js/SliceArray'
  import {formatSinger} from '../assets/js/FormatSingerName'
  import {mapState} from 'vuex'

  export default {
    name: 'Find',

    components: {
      Banner,
      SongList
    },

    data() {
      return {
        bannerInfo: [],
        navbarData:[
          {title: '歌单'},
          {title: '电台'},
          {title: '推荐'},
          {title: '推荐'}
        ],
        recommendData: [],
        newSongData: [],
        iconData: []
      }
    },

    computed:{
      ...mapState(['playing','playList'])
    },

    created() {
      this.getbannerImgs();
      this.getIcon();
      this.getRecommendSongList();
      this.getnewSong();
    },

    methods: {
      // 获取banner图片
      getbannerImgs() {
        this.axios({
          method: 'GET',
          url: '/banner?type=2'

        }).then(result => {
          // 
          let data = result.data.banners;
          if(result.data.code == 200) {
            this.bannerInfo = data;
          }
        }).catch(err => {
          
        })
      },

      // 获取图标
      getIcon(){
        this.axios({
          method: 'GET',
          url: '/homepage/dragon/ball'
        })
        .then(result => {
          if(result.data.code == 200){
            let goPageArr = ['List','Rank','','',''];
            let data = result.data.data.slice(1,6);
            data.map((v,i) =>{
              v.go = goPageArr[i];
            })
            this.iconData = data;
          }
        })
        .catch(err => {
          
        })

      },

      // 获取推荐歌单
      getRecommendSongList() {
        this.axios({
          method: 'GET',
          url: '/personalized',
          params: {
            limit: '6'
          }
        })
        .then(result => {
          if(result.data.code == 200) {
            this.recommendData = result.data.result;
          }
        })
        .catch(err => {
          
        })
      },

      // 获取最新音乐
      getnewSong() {
        this.axios({
          method: 'GET',
          url: '/personalized/newsong',
          params: {
            limit: '9'
          }
        })
        .then(result => {
          if(result.data.code == 200) {
            let data = result.data.result;
            data.map(v => {
              v.islike = false;
            })
            // 
            let nameArr = formatSinger.formatSingerName(data,'new');
            for(let i=0; i<data.length; i++){
              data[i].singer = nameArr[i];
            }
            // 每3首歌曲截取为一个数组
            this.newSongData = sliceArray.sliceArr(data,3);
          }
        })
        .catch(err => {
          
        })
      },

      // 根据id获取最新音乐的url
      getAudioItem(item) {
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })

        this.axios({
          method: 'GET',
          url: '/song/url',
          params: {
            id: item.id
          }
        })
        .then(result => {
          // 
          let currentUrl = result.data.data[0].url;
          if(result.data.code == 200) {
            this.$toast.clear();
            item.songUrl = currentUrl;

            // 设置当前播放的歌曲
            this.$store.commit('setCurrentSong',item);
            // 播放状态
            this.$store.commit('playStatus',true);
            
            // 设置播放列表 并判断是否添加了同一首歌
              this.$store.dispatch('HandlePlayList',item);
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        })

      },

      // 根据歌单id跳到歌单页面
      selectRecommendId(item) {
        this.$store.commit('setSongList',item);
        let id = item.id;
        this.$router.push({name: 'MusicList',params:{id}});
      },

      // 点击中部圆形导航
      goCircle(name){
        
        if(name==''){
          this.$toast('该功能开发中...')
        }else{
          this.$router.push({name});
        }

      }

    }
  }
</script>
