export const actions = {
   // 进一步处理播放列表
    HandlePlayList(context,currentSong){
      // 测试歌曲是否存在播放列表中
      let exist = context.state.playList.find(item => item.id == currentSong.id)
      if(exist){
        return;
      }else{
        context.commit('setPlayList',currentSong);
      }
    },

    // 歌单list
    changeSongList({commit},data){
      commit('changeSongList',data);
    } 
   
}