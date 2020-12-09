<template>
  <div class="songlist">
    <div class="songlist-box">
      <!-- 自定义滑块 最新音乐区域 -->
      <van-swipe :loop="false" @change="onChange" ref="swipe" >
        <van-swipe-item v-for="(item,index) in newsongs" :key="index" >
          <div class="list-item" v-for="(v,k) in item" :key="k" @click="getCurrentItem(v)">
            <div class="img-box">
              <img :src="v.picUrl" class="auto-img">
              </div>
              <div class="desc">
                <div class="clearfix song-info">
                  <div class="fl song-name">{{v.name}}</div>
                  <div class="fl alias" v-if="v.song.alias.length>0">({{v.song.alias[0]}})</div>
                </div>
                <div class="singer">{{v.singer}}</div>
              </div>
              <div class="play-icon">
                <van-icon :name="currentSong.id == v.id ? 'volume-o' : 'play-circle-o'" :color="currentSong.id == v.id ? '#feef9a' : '#fff'" size="20" />
              </div>
          </div>
        </van-swipe-item>
      
      </van-swipe>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: 'SongList',

    props: ["newsongs"],

    data() {
      return {
        swiperItem: [],
      }
    },

    computed: {
      ...mapState(['currentSong','playing'])
    },


    methods: {
      // 改变当前滑块宽度
      onChange(index) {
        this.$nextTick(() => {
          let swipes = this.$refs.swipe.$el.querySelectorAll('.van-swipe-item');

          // 设置当前index的滑块宽度为9.1rem 小于当前index的滑块宽度为9.46rem(375-20)
          for(let i=0; i<swipes.length; i++){
            if(i==index) {
              swipes[i].style.setProperty('width', '9.1rem', 'important');
            }else{
              swipes[i].style.setProperty('width', '9.46rem', 'important');
            }
          }
        })
      },

      // 获取当前点击的音乐
      getCurrentItem(item) {
        this.$emit('getItem',item);
      }

    }
  }
</script>

<style lang="less" scoped>
.songlist{
  /deep/ .van-swipe__indicators{
    display: none;
  }
  /deep/ .van-swipe-item:nth-of-type(1){
    width: 9.1rem !important;
  }

  .songlist-box{
    padding: 0 10px;
  }
  .list-item{
    padding: 10px 10px 0px 0;
    display: flex;
  }
  .img-box{
    width: 60px;
    height: 60px;
    border-radius: 8px;
    overflow: hidden;
    background-color: #333;
  }
  .desc{
    flex: auto;
    margin-left: 10px;
    padding: 10px 0;
    color: #dedede;
    overflow: hidden;
  }
  .song-info{
    font-size: 14px;
    height: 20px;
    line-height: 20px;
    font-weight: bold;
  }
  .song-name{
  }
  .alias{
    width: 134px;
    color: #999999;
    margin-left: 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .singer{
    text-align: left;
    margin-top: 3px;
    color: #999999;
  }
  .play-icon{
    width: 30px;
    color: #ffffff;
    margin-top: 22px;
    text-align: center;
  }
}
</style>