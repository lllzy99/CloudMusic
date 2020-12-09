<template>
  <div class="rank">
    <div class="rank-box">
      <!-- 官方榜 -->
      <div class="office-rank">
        <div class="title">官方榜</div>
        <div class="rank-item clearfix" v-for="(item,index) in toplist" :key="index">
          <div class="fl rank-img">
            <img :src="item.coverImgUrl" class="auto-img">
          </div>
          <div class="fl rank-info">
            <div class="one-text" v-for="(v,k) in item.tracks" :key="k" @click="getTopListDetail(item)">{{v.first}} - {{v.second}}</div>
          </div>
        </div>
      </div>
      <!-- 特色榜 -->
      <div class="feature-rank">
        <div class="title">特色榜</div>
        <div class="feature-rank-box"> 

          <div class="feature-item" v-for="(item,index) in featureList" :key="index" @click="getTopListDetail(item)">
            <div class="feature-img">
              <img class="auto-img" :src="item.coverImgUrl" >
            </div>
            <div class="feature-info">{{item.name}}</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import '../assets/less/rank.less' 
  export default {
    name: 'Rank',

    data(){
      return{
        toplist: [],
        featureList: [],
      }
    },

    created(){
      this.getTopList();
    },

    methods: {
      getTopList(){
        this.axios({
          method: 'GET',
          url: '/toplist/detail',
        })
        .then(result => {
          if(result.data.code == 200){
            
            this.toplist = result.data.list.slice(0,4);
            this.featureList = result.data.list.slice(4,10);
          }
        })
      },

      // 获取榜单详情数据
      getTopListDetail(item){
        this.$router.push({name: 'MusicList', params:{id:item.id}, query:{isTopType:item.ToplistType}});
      }


    }
  }
</script>
