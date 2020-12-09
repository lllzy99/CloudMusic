<template>
  <div id="app">

    <MiniBar></MiniBar>

    <router-view/>
    
  </div>
</template>

<script>
  import MiniBar from './components/MiniBar.vue'
  export default {
    name: 'app',

    components: {
      MiniBar
    },

    created(){
      this.setLocal('history_play');
      this.setLocal('likeSong_data');
      this.setLocal('allSongList_data');
    },

    methods: {
      setLocal(key){
        let history = localStorage.getItem(key);
        if(!history){
          localStorage.setItem(key,JSON.stringify([]));
        }
      }
    }


  }
</script>

<style lang="less">
body{
  margin: 0;
  padding: 0;
  background-color: #3c3c3c;
  // background-color: #ccc;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.auto-img{
  width: 100%;
  display: block;
}
.clearfix::after{
  content: '';
  display: block;
  clear: both;
}
ul{
  margin: 0;
  padding: 0;
}
li{
  list-style-type: none;
}
p{
  margin: 0;
}
.fl{
  float: left;
}
.fr{
  float: right;
}
.one-text{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.two-text{
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

</style>
