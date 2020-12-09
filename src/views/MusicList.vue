<template>
  <div class="musiclist">
    <SonglistDetail :SongListDetail="SongListDetail" :isTopType="isTopType"></SonglistDetail>
    <SonglistItem></SonglistItem>
  </div>
</template>

<script>
  import SonglistDetail from '../components/SonglistDetail.vue'
  import SonglistItem from '../components/SonglistItem.vue'
  import {formatSinger} from '../assets/js/FormatSingerName'
  import { mapState } from 'vuex'
  export default {
    name: 'MusicList',
    components:{
      SonglistDetail,
      SonglistItem
    },

    data() {
      return {
        // 歌单id
        id: '',
        // 是否为榜单类型
        isTopType: false,
        SongListDetail: {}
      }
    },

    created() {
      // 歌单id
      this.id = this.$route.params.id;
      // 是否是榜单类型
      let type = this.$route.query.isTopType;
      this.isTopType = type==undefined? false : type;
      // 获取歌单详情
      this.getSongListDetail();
    },

    methods: {
      // 根据歌单ID获取歌单详情
      getSongListDetail(){

        // 判断本地是否有数据
        const songlistLocal = JSON.parse(localStorage.getItem('allSongList_data'));
        if(songlistLocal.length>0){
          let check = songlistLocal.some(v => {
            if(v.id==this.id && v.expired>Date.now()){
              
              this.SongListDetail = v.details;
              this.$store.commit('changeAllSongData',v.data);
              return true;
            }
          })

          if(check){
            return;
          }
        }
        
        this.axios({
          method: 'GET',
          url: '/playlist/detail',
          params: {
            id: this.id
          }
        })
        .then(result => {
          if(result.data.code == 200) {
            
            // 歌单详情
            this.SongListDetail = result.data.playlist;
            let trackIds = result.data.playlist.trackIds;
            let trackIdsArr = [];
            trackIds.map(v => {
              trackIdsArr.push(v.id);
            })
            let ids = trackIdsArr.join(',');
            // 调用函数 获取该歌单下的所有歌曲
            this.getAllSongsByTrackIds(ids,this.SongListDetail);
          }
        })
        .catch(err => {
          
        })
      },

      // 根据推荐歌单的trackIds获取该歌单的全部歌曲
      getAllSongsByTrackIds(ids,SongListDetail) {
        this.axios({
          method: 'GET',
          url: '/song/detail',
          params: {
            ids
          }
        })
        .then(result => {
          if(result.data.code == 200) {
            let data = result.data.songs;
            // 
            let allSongsID = [];
            // 构造添加singer属性
            data.map((v,i) => {
              v.singer = formatSinger.formatSingerName(data,'list_song')[i];
              allSongsID.push(v.id);
            })
            // 调用函数 获取所有歌曲url
            this.getUrl(allSongsID.join(','),data,SongListDetail)
          }
        }).catch(err => {
          
        })
      },

      // 获取歌曲的url
      getUrl(allSongsID,data,SongListDetail){
        this.axios({
          method: 'GET',
          url: '/song/url',
          params: {
            id: allSongsID
          }
        })
        .then(result => {
          if(result.data.code==200){
            let urlArr = result.data.data;
            data.map(v => {
              urlArr.map(k => {
                if(v.id == k.id){
                  v.songUrl = k.url
                }
              })
            })
            let allSongs = [];
            data.map(v => {
              let o = {};
              o.id = v.id;
              o.name = v.name;
              o.picUrl = v.al.picUrl;
              o.singer = v.singer;
              o.songUrl = v.songUrl;
              o.islike = false;
              allSongs.push(o);
            })
            this.$store.commit('changeAllSongData',allSongs);

            // 本地储存 当前歌单的所有歌曲 有效期4小时
            let allSongList = JSON.parse(localStorage.getItem('allSongList_data'));
            let o = {
              id: this.id,
              details: SongListDetail,
              data: allSongs,
              iscollect: false,
              expired: Date.now() + 4*60*60*1000
            }
            // 缓存歌单数据
            allSongList.push(o);
            localStorage.setItem('allSongList_data',JSON.stringify(allSongList));
            this.$store.commit('changeSongList',allSongList);

          }
        })
        .catch(err => {
          
        })
      }


    }
  }
</script>

<style lang="less" scoped>
  .musiclist{
    background-color: #2d2d2d;
    padding-bottom: 50px;
  }
</style>
