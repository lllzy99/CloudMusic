<template>
  <div class="songlist-item">
    <div class="bg">

      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        offset="50"
        @load="onLoad"
      >
        <div class="songlist-title clearfix">
          <div class="fl">
            <span></span>
            <span>全部歌曲({{allSongs.length}}首)</span>
          </div>
          <div class="likelist fr">
            <span v-show="!history">
              <img v-if="!iscollect" src="../assets/images/likelist-1.png" class="auto-img">
              <img v-else src="../assets/images/likelist-2.png" class="auto-img">
            </span>
            <span v-show="!history">
              <span @click="LikeList" v-if="!iscollect">收藏歌单</span>
              <span  @click="LikeList" v-else>已收藏</span>
            </span>
            
            </div>
        </div>
        <div class="song-list" v-for="(item,index) in showSongData" :key="index" @click="selectItem(item,index)">
          <div class="vol-icon" v-if="currentSong.id == item.id" >
            <van-icon name="volume-o" color="#feef9a" v-if="currentSong.id == item.id" size="20" />
          </div>
          <div class="index" v-else>{{index+1}}</div>
          <div class="song-info">
            <div class="info-top one-text">{{item.name}}</div>
            <div class="singer one-text">{{item.singer}}</div>
          </div>
          <div class="more" @click.stop="more">
            <van-icon name="ellipsis" size="20"/>
          </div>
        </div>
      </van-list>
      
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SonglistItem',

    data(){
      return{
        showSongData: [],
        loading: true,
        finished: false,
        startIndex: 0,
        dataCount: 8,
        islike: false,
        iscollect: false,
        id: '',
        localSongList: []
      }
    },

    props: ['history'],

    computed: {
      allSongs(){
        return this.$store.state.AllSongListData;
      },
      currentSong(){
        return this.$store.state.currentSong;
      }
    },

    created(){
      // 当前歌单id 用于记录收藏歌单
      this.id = this.$route.params.id;
      // 获取歌单收藏状态
      let localSongList = JSON.parse(localStorage.getItem('allSongList_data'));
      localSongList.some(v => {
        if(v.id == this.id){
          this.iscollect = v.iscollect;
          return true;
        }
      })

      // 开始时 展示的歌曲数据
      this.showSongData = this.allSongs.slice(this.startIndex,this.dataCount); 
      this.startIndex = this.startIndex + this.dataCount;
      this.loading = false;
    },

    // 监听computed的allSongs 展示前8条数据
    watch: {
      allSongs(newV,oldV){
        return newV;
      }
    },

    methods: {
      // 懒加载歌单的歌曲
      onLoad(){
        // 
        setTimeout(() => {
          let data = this.allSongs.slice(this.startIndex,this.startIndex+this.dataCount);
          this.startIndex += this.dataCount;

          this.showSongData.push(...data);

          // 剩余数据不足时
          if(data.length < this.dataCount){
            // 加载完毕
            this.finished = true;
          }else{
            // 某次数据更新完毕
            this.loading = false;
          }
        },1500)
      },

      // 播放歌曲
      selectItem(item,index) {
        // 
        this.$store.commit('setCurrentSong',item);
        // 
        this.$store.commit('setPlayList',this.allSongs);
        this.$store.commit('playStatus',true);
      },

      // 收藏歌单
      LikeList(){
        let localSongList = JSON.parse(localStorage.getItem('allSongList_data'));
        this.iscollect = !this.iscollect;

        // 收藏
        if(this.iscollect){
          localSongList.some(v => {
            if(v.id == this.id){
              v.iscollect = true;
              return true;
            }
          })
        }else{
          // 取消收藏
          localSongList.some(v => {
            if(v.id == this.id){
              v.iscollect = false;
              return true;
            }
          })
        }
        // 更新缓存
        localStorage.setItem('allSongList_data', JSON.stringify(localSongList));
      },

      // 收藏音乐
      LikeSong(item){
        item.islike = !item.islike;
        
        
        let lovesongs = JSON.parse(localStorage.getItem('likeSong_data'));
      },

      // 更多
      more(){
        this.$toast('该功能开发中~')
      }


    }
  }
</script>

<style lang="less" scoped>
.songlist-item{
  margin-top: 20px;
  padding-bottom: 50px;
  color: #ffffff;
  position: relative;
  left: 0;
  right: 0;
  // height: 60vh;
  z-index: 99;
  .bg{
    height: 100%;
  }
  .songlist-title{
    padding: 10px;
    font-size: 14px;
    background-color: #2d2d2d;
    .likelist{
      display: flex;
      >span:nth-of-type(1){
        width: 20px;
        height: 20px;
        margin-right: 5px;
      }
    }
  }
  .bg{
    background-color: #2d2d2d;
    height: 100%;

    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    .song-list{
      background-color: #2d2d2d;
      font-size: 14px;
      display: flex;
      align-items: center;
      padding: 10px 0;
    }
    .vol-icon{
      margin: 0 12px;
    }
    .index{
      width: 50px;
      text-align: center;
    }
    .song-info{
      width: calc(~"100% - 80px");
      overflow: hidden;
      .info-top{
        width: 100%;
      }
      .singer{
        font-size: 12px;
        color: #999;
        margin-top: 5px;
      }
    }
    .more{
      width: 50px;
      margin-left: 20px;
      text-align: center;
    }
  }
}
</style>