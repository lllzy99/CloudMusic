<template>
  <div class="like navbar">
    <van-nav-bar
      title="喜欢的音乐"
      fixed
      left-arrow
      @click-left="onClickLeft"
    />
    <!-- 背景 -->
    <div class="bg" v-if="localLikeSong.length>0">
      <div class="bg-l">
        <img class="auto-img" :src="localLikeSong[0].picUrl">
      </div>
      <div class="bg-r">
        <div class="title">我喜欢的音乐</div>
        <div class="sub_title">感谢永远有歌把心境道破</div>
      </div>
    </div>

    <!-- 歌曲列表 -->
    <div v-if="localLikeSong.length>0">
      <SonglistItem :history="history"></SonglistItem>
    </div>
    <div v-else>
      <van-empty description="暂无喜欢的音乐~">
      </van-empty>
    </div>
    


  </div>
</template>

<script>
  import '../assets/less/navbar.less'
  import SonglistItem from '../components/SonglistItem.vue'
  export default {
    name: 'Like',
    components: {
      SonglistItem
    },
    data(){
      return{
        localLikeSong: [],
        history: true
      }
    },

    created(){
      this.getlikeFromLocal();
    },

    methods:{
      onClickLeft(){
        this.$router.go(-1);
      },

      // 获取本地缓存的喜欢的音乐
      getlikeFromLocal(){
        this.localLikeSong = JSON.parse(localStorage.getItem('likeSong_data'));
        this.$store.commit('changeAllSongData',this.localLikeSong);
      }
    }

  }
</script>

<style lang="less" scoped>
.like{
  /deep/ .van-empty{
    padding: 100px 0;
  }
  .bg{
    padding: 10px;
    display: flex;
    align-items: center;
    background-color: #3c3c3c;
  }
  .bg-l{
    width: 100px;
    height: 100px;
    border-radius: 20px;
    overflow: hidden;
  }
  .bg-r{
    margin-left: 10px;
    width: calc(~"100% - 110px");
    .title{
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .sub_title{
      font-size: 14px;
      color: #999;
    }
  }

}
</style>