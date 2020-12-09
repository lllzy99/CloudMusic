<template>
  <div class="songlist-detail">
    <!-- 导航栏 -->
    <div class="detail-back clearfix">
      <van-icon class="fl" name="arrow-left" size="20" @click="goBack"/>
      <div class="fl">歌单</div>
    </div>
    <!-- 歌单信息 -->
    <div class="detail-top" v-if="!isTopType">
      <div class="top-l">
        <div class="img-box">
          <img class="auto-img" :src="SongListDetail.coverImgUrl">
        </div>
      </div>
      <div class="top-r">
        <div class="title">{{SongListDetail.name}}</div>
        <div class="desc" @click="showPopup">
          <div class="text">{{SongListDetail.description}}
          </div>
          <div class="right-icon">
            <van-icon name="arrow" size="14" />
          </div>
        </div>
      </div>
      <!-- 弹出层 -->
      <div class="desc-popup">
        <van-popup v-model="show" closeable class="fullPage">
          <div class="desc-bg" :style="`background-image:url(${SongListDetail.coverImgUrl})`"></div>
          <div class="desc-content">
            <div class="img-box">
              <img class="auto-img" :src="SongListDetail.coverImgUrl" alt="">
            </div>
            <div class="title">{{SongListDetail.name}}</div>
            <div class="text">{{SongListDetail.description}}</div>
          </div>
        </van-popup>
      </div>

    </div>

    <div class="detail-top-bg"  v-else>
      <img class="auto-img" :src="SongListDetail.coverImgUrl" >
    </div>

  </div>
</template>

<script>
  export default {
    name: 'SonglistDetail',

    props: {
      SongListDetail:{
        type: Object
      },
      isTopType:{}
    },

    data(){
      return{
        show: false,
        id: '',
      }
    },

    methods:{
      goBack() {
        this.$router.go(-1);
      },
      showPopup() {
        this.show = true;
      }
    }
  }
</script>

<style lang="less" scoped>
.songlist-detail{
  padding-top: 60px;
  background-color: #3d3d3d;
  .detail-back{
    padding: 20px 10px;
    width: 100%;
    color: #ffffff;
    background-color: #3d3d3d;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 100;
    >div{
      height: 20px;
      line-height: 20px;
      margin-left: 15px;
      font-size: 16px;
    }
  }
  .detail-top{
    // background-color: #fff;
    display: flex;
    padding: 10px;
  }

  .detail-top-bg{
    width: 100%;
    height: 260px;
    background-color: #fff;
  }
  .top-l{
    width: 140px;
    .img-box{
      border-radius: 8px;
      overflow: hidden;
    }
  }
  .top-r{
    width: calc(~"100% - 140px");
    margin-left: 20px;
    padding: 10px 0;
    .title{
      color: #ffffff;
      font-size: 16px;
      font-weight: bold;
    }
    .desc{
      font-size: 12px;
      display: flex;
      align-items: center;
      margin-top: 20px;
      color: #999;
    }
    .text{
      width: calc(~"100% - 20px");
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    .right-icon{
      width: 20px;
      text-align: center;
    }
  }
  .detail-list{
    color: #fff;
  }

  .fullPage{
    width: 100%;
    height: 100%;
    background-color: #3c3c3c;
    color: #ffffff;
    .desc-bg{
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      position: relative;
      filter: brightness(.8) blur(30px);
      z-index: -1;
    }
    .desc-content{
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      // z-index: 99;

    }
    .img-box{
      width: 50%;
      margin: 50px auto 20px auto;
    }
    .title{
      padding: 0 50px;
      text-align: center;
      font-weight: bold;
      font-size: 14px;
    }
    .text{
      padding: 20px;
    }
  }

}
</style>