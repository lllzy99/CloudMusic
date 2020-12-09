<template>
  <div class="history navbar">
    <van-nav-bar
      title="历史播放"
      left-arrow
      fixed
      @click-left="onClickLeft"
    />

    <!-- 历史歌单列表 -->
    <div v-if="historyData.length>0">
      <SonglistItem :history="history"></SonglistItem>
    </div>

    <div v-else>
      <van-empty description="暂无历史播放记录">
      </van-empty>
    </div>
  </div>
</template>

<script>
  import '../assets/less/navbar.less'
  import SonglistItem from '../components/SonglistItem.vue'
  export default {
    name: 'History',

    components: {
      SonglistItem
    },

    data(){
      return{
        historyData: [],
        history: true
      }
    },
    created() {
      this.getHistoryFromLocal();
    },
    methods:{
      onClickLeft(){
        this.$router.go(-1);
      },

      // 获取本地缓存的听歌历史记录
      getHistoryFromLocal(){
        this.historyData = JSON.parse(localStorage.getItem('history_play'));
        this.$store.commit('changeAllSongData',this.historyData);
      }
    }
  }
</script>

<style lang="less" scoped>
  .history{
    /deep/ .van-empty{
      padding: 100px 0;
    }
   .songlist-item{
     margin-top: 0;
   }
  }
</style>