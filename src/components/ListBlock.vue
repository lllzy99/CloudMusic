<template>
  <div class="listblock">
    <!-- 歌单item -->
    <div class="list-item" v-for="(item,index) in playlistsData" :key="index" @click="selectRecommendId(item)">
      <div class="list-img">
        <img class="auto-img" :src="item.coverImgUrl">
      </div>
      <div class="list-desc two-text">{{item.name}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ListBlock',

    methods: {
      // 根据歌单id跳到歌单页面
      selectRecommendId(item) {
        this.$store.commit('setSongList',item);
        let id = item.id;
        this.$router.push({name: 'MusicList',params:{id}});
      },
    }
  }
</script>