<template>
  <div class="banner">
    <van-swipe class="my-swipe" indicator-color="#ffef99" autoplay="2000">
      <van-swipe-item v-for="(item,index) in bannerInfo" :key="index">
        <div class="img-box">
          <img class="auto-img" :src="item.pic">
          <div class="banner-title" :style="{background: item.titleColor=='red' ? '#ec4040' : '#4a79cc'}" >
            <div class="text">{{item.typeTitle}}</div>
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
  export default {
    name: 'Banner',

    props: {
      bannerInfo: {
        type: Array
      }
    }
  }
</script>

<style lang="less" scoped>
  .banner-title{
    background-color: #fff;
    height: 20px;
    line-height: 20px;
    border-top-left-radius: 5px;
    position: absolute;
    right: 0px;
    bottom: 0px;
    .text{
      height: 20px;
      line-height: 20px;
      margin-top: 1px;
      font-size:12px;
      padding: 0 8px;
      color: #f5f5f5;
      transform: scale(.9);
    }
  }
</style>