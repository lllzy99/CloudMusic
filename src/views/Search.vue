<template>
  <div class="search">
    <!-- 顶部 -->
    <div class="topnav">
      <div class="back">
        <van-icon name="arrow-left" color="#fff" size="20" @click="goBack" />
      </div>
      <div class="search-box">
        <van-search
        ref="searchIpt"
        v-model="iptValue"
        placeholder="请输入搜索关键词"
        @input="searchInput"
        @search="search" />
      </div>
    </div>

    <!-- 搜索记录 -->
    <div class="history-wrapper" v-if="historyList.length > 0">
      <div class="title clearfix" >
        <div class="fl">历史搜索</div>
        <div>
          <div class="fr remove-icon"><van-icon name="delete" size="16" @click="empty"/></div>
          <div class="fr clear">清空</div>
        </div>
      </div>
      <div class="history clearfix">
        <div class="history-box">
          <div class="history-item fl" v-for="(item,index) in historyList" :key="index" @click="cloudsearch(item)">{{item}}</div>
        </div>
        </div>
    </div>

    <!-- 热搜列表 -->
    <div class="hot-rank" v-show="!isSearch">
      <div class="title">热搜榜</div>
      <div class="hot-item" v-for="(item,index) in hotData" :key="index" @click="cloudsearch(item.searchWord)">
        <div class="hot-index" :class="{'active': index<=2}">{{index+1}}</div>
        <div class="hot-info">
          <div class="song-name clearfix">
            <div class="fl">{{item.searchWord}}</div>
            <span class="type fl" v-if="item.iconType==1"><img class="auto-img" :src="item.iconUrl"></span>
          </div>
          <div class="song-desc">{{item.content}}</div>
        </div>
        <div class="hot-score">{{item.score}}</div>
      </div>
      
    </div>

    <!-- 搜索建议 -->
    <div class="search-suggest" v-show="isSuggest">
      <div class="suggest-msg" v-for="(item,index) in searchMatch" :key="index" @click="cloudsearch(item.keyword)">{{item.keyword}}</div>
    </div>

    <!-- 搜索多重匹配 -->
    <div class="search-match" v-show="isSearch">
      <div class="title">单曲</div>
      <div class="song-item" v-for="(item,index) in matchSong" :key="index" @click="getItem(item)">
        <div class="song-info">
          <div class="songname one-text">{{item.name}}</div>
          <div class="singer">{{item.ar[0].name}}</div>
        </div>
        <div class="play-icon">
          <van-icon name="volume-o" color="#feef9a" size="20" v-if="currentSong.id==item.id"/>
          <van-icon name="play-circle-o"  size="20" v-else />
        </div>
      </div>
    </div>

  </div>
</template>




<script>
  import '../assets/less/search.less'
  import {mapState} from 'vuex'
  export default {
    name: 'Search',

    data(){
      return {
        // 搜索框内容
        iptValue: '',
        isSearch: false,
        isSuggest: false,
        active: 0,

        // 热搜榜
        hotData: [],
        // 搜索建议
        searchMatch:[],
        // 匹配的歌曲
        matchSong: [],
        // 历史记录
        historyList: []
      }
    },

    computed:{
      ...mapState(['playing','playList','currentSong'])
    },

    created() {
      // 获取热搜榜
      this.getHot();
      // 搜索框自动获取焦点
      this.$nextTick(() => {
        let input = this.$refs.searchIpt.querySelector('[type="search"]');
        input.focus();
      })

      // 初始化历史搜索列表
      let historyList = localStorage.getItem('historyList');
      if(!historyList){
        return;
      }else{
        this.historyList = JSON.parse(historyList)
      }
    },

    methods: {
      // 返回
      goBack(){
        this.$router.go(-1);
      },
      // 获取热搜榜单
      getHot(){
        this.axios({
          methods: 'GET',
          url: '/search/hot/detail',
        })
        .then(result => {
          if(result.data.code == 200){
            this.hotData = result.data.data;
          }
        })
        .catch(err => {
          
        })
      },

      // 搜索框内容发生变化 获取搜素建议
      searchInput(){
        // 判断输入内容是否为空或纯空格
        let reg = /^[ ]+$/;
        if(this.iptValue=='' || reg.test(this.iptValue)) {
          this.iptValue = '';
          this.isSuggest=false;
          return;
        }
        this.isSuggest = true;
        this.axios({
          methods: 'GET',
          url: '/search/suggest',
          params: {
            keywords: this.iptValue,
            type: 'mobile'
          }
        })
        .then(result => {
          if(result.data.code == 200){
            // 
            let data = result.data.result.allMatch;
            this.searchMatch = data;
          }
        })
        .catch(err => {
          
        })
      },

      //回车搜索
      search(){
        // 判断输入内容是否为空或纯空格
        let reg = /^[ ]+$/;
        if(this.iptValue=='' || reg.test(this.iptValue)) {
          this.$toast('请输入搜索内容');
          this.iptValue = '';
          return;
        }

        // 保存搜索记录
        this.setHistory(this.iptValue);

        this.isSuggest = false;
        this.cloudsearch(this.iptValue);

      },
      
      // 搜索多重匹配
      cloudsearch(keyword){
        this.setHistory(keyword);
        this.iptValue = keyword
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })
        this.axios({
          methods: 'GET',
          url: '/cloudsearch',
          params: {
            keywords: keyword,
          }
        })
        .then(result => {
          if(result.data.code == 200){
            this.$toast.clear();
            // 
            this.isSearch = true;
            this.isSuggest = false;
            let data = result.data.result.songs;
            this.matchSong = data;
          }
        })
        .catch(err => {
            this.$toast.clear();
          
        })
      },

      // 清空历史记录
      empty(){
        localStorage.removeItem('historyList');
        this.historyList = [];
      },

      // 播放单曲
      getItem(item){
        
        // 根据id获取最新音乐的url
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
          let currentUrl = result.data.data[0].url;
          if(result.data.code == 200) {
            this.$toast.clear();
            item.songUrl = currentUrl;
            item.picUrl = item.al.picUrl;

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

      // 记录搜索历史
      setHistory(keyword){
        // 检查有无搜索记录
        if(this.historyList.length==0){
          this.historyList.unshift(keyword);
        }else if(!this.historyList.includes(keyword)){
          this.historyList.unshift(keyword);
        }
        else{
          let i = this.historyList.indexOf(keyword);
          this.historyList.splice(i,1)
          this.historyList.unshift(keyword);
        }
        localStorage.setItem('historyList',JSON.stringify(this.historyList));

      }



      }
  }
</script>
