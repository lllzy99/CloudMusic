// 根据歌手数组格式化歌手名字
class FormatSingerName{
  constructor(){}
  
  formatSingerName(data,type){
    // data 为歌曲信息数组
    let artistsArr = [];
    if(type=='new'){
      data.map(v => {
        artistsArr.push(v.song.artists);
      })
    }else if(type=='list_song'){
      data.map(v => {
        artistsArr.push(v.ar);
      })
    }
    
    let nameArr = [];
    // 拼接歌手名字,并截取掉最后的/
    artistsArr.map(v => {
      let name = '';
      v.map(value => {
        name += value.name+'/';
      })
      name = name.slice(0,name.length-1);
      nameArr.push(name);
    })
    return nameArr;
  }
}

export const formatSinger = new FormatSingerName(); 