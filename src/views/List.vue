<template>
  <div class="list">
    <div class="list-tabs">
      <van-tabs @change="toogleTab"  v-model="activeName">
        <van-tab v-for="(item,index) in listData" :title="item.name" :key="index" :name="item.name">
          <div class="list-content">

            <!-- 歌单item -->
            <div class="list-item" v-for="(item,index) in playlistsData" :key="index" @click="selectRecommendId(item)">
              <div class="list-img">
                <img class="auto-img" :src="item.coverImgUrl">
              </div>
              <div class="list-desc two-text">{{item.name}}</div>
            </div>

          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
  import '../assets/less/list.less'
  import {mapState} from 'vuex'
  export default {
    name: 'list',

    data() {
      return {
        activeName: '华语',
        listData: [],
        playlistsData: []
      }
    },

    computed: {
      // ...mapState(['currentAudio'])
    },

    created(){
      // 
      this.getListType();

      this.toogleTab();
    },

    methods: {

      // 获取歌单分类
      getListType(){
        this.axios({
          method: 'GET',
          url: '/playlist/hot'
        })
        .then(result => {
          if(result.data.code == 200) {
            // 
            let data = result.data.tags;
            data.splice(7,1);
            this.listData = data;
           
          }
        })
        .catch(err => {
          
        })
      },

      // 根据歌单tab类型获取具体歌单
      toogleTab(){
        this.axios({
          method: 'GET',
          url: '/top/playlist/highquality',
          params: {
            cat: this.activeName
          }
        })
        .then(result => {
          if(result.data.code == 200) {
            
            let data = result.data.playlists;
            this.playlistsData = data;
          }
        })
        .catch(err => {
          
        })

      },

      // 根据歌单id跳到歌单页面
      selectRecommendId(item) {
        this.$store.commit('setSongList',item);
        let id = item.id;
        this.$router.push({name: 'MusicList',params:{id}});
      },

    }
  
  }
</script>


