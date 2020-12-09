<template>
  <div class="likelist navbar">
    <van-nav-bar
      title="收藏歌单"
      left-arrow
      fixed
      @click-left="onClickLeft"
    />

    <div class="likelist-box" v-if="filter.length>0">
      <div class="likelist-item" v-for="(item,index) in filter" :key="index" @click="goListId(item)">
        <div class="img-box">
          <img class="auto-img" :src="item.details.coverImgUrl">
        </div>
        <div class="desc">
          <div class="title two-text">{{item.details.name}}</div>
          <div class="count">{{item.data.length}}首</div>
        </div>
      </div>
    </div>

    <div v-else>
      <van-empty description="暂无收藏的歌单~">
      </van-empty>
    </div>

  </div>
</template>

<script>
  import '../assets/less/navbar.less'
  export default {
    name: 'Likelist',

    data(){
      return{
        filter:[]
      }
    },

    created(){
      this.getLikeList();
    },

    methods:{
      onClickLeft(){
        this.$router.go(-1);
      },

      getLikeList(){
        let likelist = JSON.parse(localStorage.getItem('allSongList_data'));
        let filter = likelist.filter(v => {
          return v.iscollect;
        })
        this.filter = filter;
      },

      // 根据歌单id跳到歌单页面
      goListId(item) {
        let id = item.id;
        this.$router.push({name: 'MusicList',params:{id}});
      },
    }
  }
</script>

<style lang="less" scoped>
.likelist{
   /deep/ .van-empty{
    padding: 100px 0;
  }
  .likelist-box{
    width: calc(~"100% - 20px");
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
  }

  .likelist-item{
    width: calc(~"50% - 10px + 10px/2");
    height: 100%;
    margin-right: 10px;
    margin-bottom: 10px;
    display: flex;

    &:nth-of-type(2n){
      margin-right: 0;
    }
  }

  .img-box{
    width: 65px;
    height: 65px;
    border-radius: 10px;
    overflow: hidden;
  }

  .desc{
    width: calc(~"100% - 70px");
    margin-left: 5px;
    margin: auto 0 auto 5px;
  }
  .title{
    font-size: 12px;
  }
  .count{
    margin-top: 5px;
    font-size: 10px;
    color: #999;
  }
}
</style>