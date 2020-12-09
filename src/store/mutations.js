export const mutations = {
  // 设置当前播放歌曲信息
  setCurrentSong(state,currentSong){
    state.currentSong = currentSong;
  },
  // 点击歌单 设置歌单详情页信息
  setSongList(state,songList){
    state.songList = songList;
  },
  // 设置播放状态
  playStatus(state,isplay){
    state.playing = isplay;
  },
  // 控制播放列表
  setPlayList(state,playList){
    if(Array.isArray(playList)){
      state.playList = playList;
    }else{
      state.playList.unshift(playList);
    }
  },
  // 设置当前播放歌曲的索引值
  setCurrentIndex(state,index){
    state.currentIndex = index;
    state.currentSong = state.playList[state.currentIndex];
  },
  // 当前播放时间
  changeCurrentTime(state,t){
    state.currentTime = t;
  },
  // 设置歌单列表的所有歌曲
  changeAllSongData(state,data){
    state.AllSongListData = data;
  },

  // 需要缓存的歌单数据
  changeSongList(state,data){
    // state.songListDataLocal.push(data);
    state.songListDataLocal = data;
  },

  // 添加历史播放
  addHistory(state,cur){
    state.historyPlay.push(cur);
  },

  setCurrentAudio(state,au){
    state.serCurrentAudio = au;
  }

}