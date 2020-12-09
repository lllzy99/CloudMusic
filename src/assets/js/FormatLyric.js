class FormatLyric{
  constructor(){}
  
  formatLyric(lyric){
    // 按照空格裁剪歌词字符串
    let arr = lyric.split(/\n/);
    
    // 处理空的歌词行
    let reg1 = /^\[(\d+):(\d+\.\d+)\]$/;
    for(let i=0; i<arr.length; i++){
      if(reg1.test(arr[i])){
        arr.splice(i,1);
        i--;
      }
    }
    // 去除部分歌词中最后一行为空的歌词行
    if(arr[arr.length-1].length==0){
      arr.pop();
    }
    
    // 正则组匹配 分离时间与歌词
    // [00:12.570]难以忘记初次见你
    // 转为以下格式
    // {time: 12, sing: '难以忘记初次见你'}
    return arr.map(lyc => {
      let reg = /\[(\d+):(\d+\.\d+)\](.+)/
      reg.test(lyc);
      return {
          time: parseInt(RegExp.$1) * 60 + parseFloat(RegExp.$2),
          sing: RegExp.$3
      }
    })
  }
}

export const formatLyc = new FormatLyric(); 