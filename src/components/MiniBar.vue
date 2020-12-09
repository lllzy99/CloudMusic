<template>
  <div class="miniBar" v-if="playList.length>0 && currentSong.songUrl != null">

    <!-- 进入全屏播放页面 -->
    <div>
      <van-popup v-model="isShowFullPage" class="fullPlay">
        <div class="popup-bg" :style="`background-image:url(${currentSong.picUrl})`"></div>
        <div class="popup-content">
          <!-- 顶部导航 -->
          <div class="play-navbar">
            <div class="play-back" @click="goBack">
              <van-icon name="arrow-left" size="24" />
            </div>
            <div class="play-songInfo">
              <div>{{currentSong.name}}</div>
              <div class="one-text">{{currentSong.singer}}</div>
            </div>
            <div class="play-share">
              <img class="auto-img" src="../assets/images/share.png" alt="">
            </div>
          </div>
          <!-- 中间区域 -->
          <div class="play-middle" @click.stop="showLyric">
            <!-- 歌曲图片 -->
            <div class="record" v-show="!isShowLyric">
              <!-- 音频可视化画布 -->
              <canvas id="wrap" ref="wrap" height="300" width="300"></canvas>
              <!-- 歌曲封面图片 -->
              <div class="record-img" >
                <img class="auto-img" :src="currentSong.picUrl || currentSong.al.picUrl" :class="rorate" />
              </div>
            </div>
            <!-- 歌词 -->
            <div class="lyric" v-show="isShowLyric" ref="lyric">
              <div v-if="!isHaslrc" class="nolrc">暂无歌词</div>
              <div ref="wrapper" v-else :style="{top: wrapperTop + 'px'}">
                <p ref="lyricLine" v-for="(item,index) in currentLyric" :key="index" :class="{active:currentLyricIndex === index}">{{item.sing}}</p>
              </div>
            </div>
            <!-- 操作栏 -->
            <div class="operate-box">
              <div class="operate-item" @click.stop="toogleLike">
                <van-icon color="#ccc" size="22px" name="like-o" v-show="!currentSong.islike" />
                <van-icon color="#ec4040" size="22px" name="like" v-show="currentSong.islike" />
              </div>
              <div class="operate-item"><van-icon color="#ccc" size="22px" name="service-o" /></div>
              <div class="operate-item"><van-icon color="#ccc" size="22px" name="chat-o" /></div>
              <div class="operate-item"><van-icon color="#ccc" size="22px" name="share-o" /></div>
            </div>
          </div>
          <!-- 进度条 -->
          <div class="play-progress">
            <div class="currentTime">{{formatStartT}}</div>
            <div class="play-slider">
              <van-slider
                v-model="sliderValue"
                max=100
                button-size="10px"
                inactive-color="#7c7a7a"
                active-color="#ffffff"
                @input="changeProgress" />
            </div>
            <div class="duration">{{formatDuration}}</div>
          </div>
          <!-- 播放控制区域 -->
          <div class="play-control">
            <!-- 播放模式 -->
            <div class="play-mode" @click="changMode">
              <img class="auto-img" :src="modeIcon[playMode].src" />
            </div>
            <!-- 上一曲 -->
            <div class="lastsong" @click="changeIndex(-1)">
              <img class="auto-img" src="../assets/images/last.png">
            </div>
            <!-- 播放按钮 -->
            <div class="play-btn" @click="toggleStatus">
              <img class="auto-img" :src="playing ? playIcon[0].src : playIcon[1].src" >
              <!-- <img class="auto-img" src="../assets/images/pause.png" v-else> -->

            </div>
            <!-- 下一曲 -->
            <div class="nextsong" @click="changeIndex(1)">
              <img class="auto-img" src="../assets/images/next.png">
            </div>
            <!-- 播放列表 -->
            <div class="play-list" @click="showPopup">
              <van-icon name="wap-nav" size="28px" />
            </div>
          </div>
        </div>
      </van-popup>

      <!-- 底部播放栏 -->
      <div class="miniplay-box">
        <div class="img-box" @click="openFullPage">
          <img class="auto-img" :src="currentSong.picUrl || currentSong.al.picUrl" :class="rorate" />
        </div>
        <div class="song-detail">
          <div class="song-name">{{currentSong.name}}</div>
          <div class="singer-name">{{currentSong.singer}}</div>
        </div>
        <div class="play-btn" @click="toggleStatus">
          <!-- 环形进度条 -->
          <van-circle size="30px" class="playCircle" 
          v-model="sliderValue"
          :rate="0"  
          color="#feef9a"
          :layer-color="playing ? '#ccc' : '#ffffff'">
            <van-icon name="play" size="20px" v-if="!playing"/>
            <van-icon name="pause" size="20px" v-else />
          </van-circle>
        </div>
        <div class="songlist" @click="showPopup">
          <van-icon name="wap-nav" size="28px" />
        </div>
      </div>

      <!-- 播放列表弹出层 -->
      <div class="popup-list">
        <van-popup v-model="isShowPopup" position="bottom" round closeable :style="{ maxHeight:'60%' }">
          <div class="title">播放列表 共{{playList.length}}首歌</div>
          <div class="songlist-item-box" v-for="(item,index) in playList" :key="index" @click="selectListSong(item)">
            <div class="song-info one-text">
              <div class="volume">
                <van-icon name="volume-o" color="#feef9a" v-if="currentSong.id == item.id" size="20" />
              </div>
              <div class="song-desc one-text">
                <span class="name">{{item.name}}</span>
                <span class="singer"> - {{item.singer || item.ar[0].name}}</span>
              </div>
            </div>
            <div class="remove" @click.stop="removeFromList(item)">删除</div>
          </div>
        </van-popup>
      </div>
     
    </div>

     <!-- 音频标签 -->
      <audio
      ref="audio"
      crossOrigin="anonymous"
      :src="currentSong.songUrl"
      @timeupdate="timeupdate"
      @ended="ended"
      autoplay
      >
      </audio>


  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {formatLyc} from '../assets/js/FormatLyric'
  import {randomArray} from '../assets/js/RandomArr'
  import '../assets/less/miniBar.less'
  export default {
    name: 'MiniBar',

    data() {
      return {
        isShowPopup: false,
        isShowFullPage: false,
        isShowLyric: false,
        currentLyric: [],
        currentLyricIndex: 0,
        sliderValue: 0,
        wrapperTop: 0,
        maxScrollH: 0,
        isHaslrc: true,
        // 总时长
        duration: 0,
        // 播放icon
        playIcon: [
          {src: require('../assets/images/pause.png')},
          {src: require('../assets/images/play.png')}
        ],
        // 播放模式 默认顺序0 单曲1 随机2
        playMode:0,
        // 播放模式icon
        modeIcon: [
          {src: require('../assets/images/list.png')},
          {src: require('../assets/images/loop.png')},
          {src: require('../assets/images/random.png')}
        ]
      }
    },

    created(){
      // 当前播放的下标
      this.playList.map((v,i) => {
        if(v.id == this.currentSong.id){
          this.$store.commit('setCurrentIndex',i);
        }
      })

    },

    computed: {
      ...mapState(['currentSong','playList','playing','currentTime','historyPlay','currentIndex']),

      //图片旋转
      rorate() {
        return this.playing ? 'play' : 'play pause';
      },

      // 过滤歌曲的时间
      formatStartT(){
        return this.format(this.currentTime);
      },
      formatDuration(){
        return this.format(this.duration);
      }
    },

    watch: {
      currentSong(){
        
        // 歌曲不能播放
        if(this.currentSong.songUrl == null){
          this.$toast('因版权方要求，当前歌曲需付费');
        }

        // 缓存播放过的歌曲
        let history = JSON.parse(localStorage.getItem('history_play'));
        let index = history.findIndex(item => item.id == this.currentSong.id);
        if(index !== -1){
          history.splice(index,1);
          history.unshift(this.currentSong);
        }else{
          history.unshift(this.currentSong);
        }
        localStorage.setItem('history_play',JSON.stringify(history));

        // 播放索引值
        this.playList.some((v,i) => {
          if(v.id == this.currentSong.id){
            this.$store.commit('setCurrentIndex',i);
            return true;
          }
        })
      }

    },

    methods: {
      // 返回
      goBack() {
        this.isShowFullPage = false;
      },

      // 收藏音乐
      toogleLike(){
        this.currentSong.islike = !this.currentSong.islike
        let locallike = JSON.parse(localStorage.getItem('likeSong_data'));
        // 收藏
        if(this.currentSong.islike){
           
            locallike.unshift(this.currentSong);
        }else{
          // 取消收藏
          locallike.some((v,i) => {
            if(v.id == this.currentSong.id){
              locallike.splice(i,1);
              return true;
            }
          })
        }
        // 重新设置缓存
        localStorage.setItem('likeSong_data',JSON.stringify(locallike));
      },

      // 显示播放列表弹出层
      showPopup() {
        this.isShowPopup = true;
      },

      // 点击播放列表的歌曲
      selectListSong(item){
        this.$store.commit('playStatus',true);
        this.$store.commit('setCurrentSong',item);
        this.getCurrentLyric();
      },

      // 展示全屏播放页
      openFullPage() {
        this.isShowFullPage = true;
        // 获取歌词
        this.getCurrentLyric();
        // 
        this.showCanvas();
      },

      // 音频可视化画布
      showCanvas(){
        this.$nextTick(() => {
          let wrap = this.$refs.wrap;

          let cxt = wrap.getContext("2d");
          //获取API
          let  AudioContext = window.AudioContext || window.webkitAudioContext;
          let context = new AudioContext;
          //创建节点
          var source = context.createMediaElementSource(this.$refs.audio);
          var analyser = context.createAnalyser();
          //连接：source → analyser → destination
          source.connect(analyser);
          analyser.connect(context.destination);
          //创建数据
          var output = new Uint8Array(360);
          (function drawSpectrum(){
            //获取频域数据
            analyser.getByteFrequencyData(output);
            // 

            // cxt.clearRect(0, 0, wrap.width, wrap.height);
            cxt.clearRect(0, 0, 300, 300);
            //画线条
            for (var i = 0; i < 360; i++) {
                // 根据获取到的数据设置线条长度
                var value = output[i] / 8;
                cxt.beginPath();
                cxt.lineWidth = 2;
                cxt.strokeStyle='#fff';
                cxt.moveTo(150, 150);
                cxt.lineTo(Math.cos((i*2) / 180 * Math.PI)*(value+130)+150 , (- Math.sin((i *2) / 180 * Math.PI)*(value+130)+150));
                cxt.stroke();
            }
            //画一个小圆，将中间区域的线条覆盖
            cxt.beginPath();
            cxt.lineWidth = 1;
            cxt.arc(150, 150, 130, 0, 2 * Math.PI, false);
            cxt.fillStyle = "#fff";
            cxt.stroke();
            cxt.fill();
            //反复调用 请求下一帧
            requestAnimationFrame(drawSpectrum);

          })()
        })
       
      },

       // 监听音频的变化
      timeupdate(e) {
        // 总时长
        this.duration = e.target.duration;
        // 设置当前播放时间
        this.$store.commit('changeCurrentTime',e.target.currentTime);
        // 进度条移动
        this.sliderValue = parseInt((this.currentTime / this.duration) *100);
        // 歌词高亮
        this.lightLyric();
      },

      // 格式化音频时长
      format(time){
        let minutes = parseInt(time/60);
        minutes = minutes<10 ? '0'+minutes : minutes;
        let seconds = Math.round(time%60);
        seconds = seconds<10 ? '0'+seconds : seconds;
        return `${minutes}:${seconds}`;
      },

      // 获取歌词
      getCurrentLyric() {
        this.axios({
          method: 'GET',
          url: '/lyric',
          params: {
            id: this.currentSong.id
          }
        }).then(result => {
          if(result.data.code == 200) {
            if(result.data.nolyric){
              this.isHaslrc = false;
              return;
            }
            let lyc = result.data.lrc.lyric;
            // 
            // 格式化歌词
            this.currentLyric = formatLyc.formatLyric(lyc);
          }
        }).catch(err => {
          
        })
      },
      
      // 当前歌词高亮
      lightLyric(){
        for(let i=0; i<this.currentLyric.length; i++){
          if(i == this.currentLyric.length-1){
            this.currentLyricIndex = i;
            return;
          }      
          let lyricT = this.currentLyric[i].time;
          let lyricNext = this.currentLyric[i+1].time;

          // 获取歌词容器最大滚动距离
          if(this.isShowLyric){
            this.maxScrollH = -(this.$refs.wrapper.scrollHeight-this.$refs.lyric.offsetHeight);  
          }

          // 展示播放页后 获取歌词行高 实现歌词滚动
          if(this.isShowFullPage){
            let lineHeight = this.$refs.lyricLine[0].clientHeight;

            if(this.currentTime>=lyricT && this.currentTime<=lyricNext){
              this.currentLyricIndex = i;

              if(this.currentLyricIndex > 6){
                let st = -lineHeight*(this.currentLyricIndex - 6);
                // 判断滚动距离是否达到最大值
                this.wrapperTop = st <= this.maxScrollH ? this.maxScrollH : st;
              }else{
                this.wrapperTop = 0
              }
              break;
          }
          }

          
        }
      },

      // 改变进度条
      changeProgress(step){
        // 设置当前播放的时间
        let curT = (step*this.duration)/100;
        this.$refs.audio.currentTime = curT;

        // 设置歌词高亮
        this.lightLyric();
      },

      // 点击播放icon 切换播放状态
      toggleStatus(){
          if(this.playing){
            this.$store.commit('playStatus',false);
            this.$refs.audio.pause();
          }else{
            this.$store.commit('playStatus',true);
            this.$refs.audio.play();
          }
      },

      // 展示歌词
      showLyric(){
        this.isShowLyric = !this.isShowLyric;
      },

      // 歌曲播放结束后
      ended(){
        switch(this.playMode){
          case 0:
            // 播放下一曲
            this.changeIndex(1);
          case 1:
            // 循环
            this.loop();
            break;
          case 2:
            // 随机
            let index = Math.floor(Math.random()*this.playList.length)
            this.$store.commit('setCurrentSong',this.playList[index]);
        }
      },

      // 循环播放
      loop(){
        this.$refs.audio.currentTime=0;
        this.$refs.audio.play();
        this.$store.commit('playStatus',true);
      },

      // 上一曲下一曲 改变索引值
      changeIndex(i){
        if(this.playMode == 1 || this.playList.length == 1){
          this.loop();
          return;
        }else{
          // 边界控制
          let index = this.currentIndex + i;
          if(index<0){
            index = this.playList.length-1;
          }
          if(index == this.playList.length){
            index = 0;
          }
          this.$store.commit('setCurrentIndex',index);
        }
      },

      // 删除播放列表的歌曲
      removeFromList(item){
        let updataList = this.playList;
        for(let i=0; i<updataList.length; i++){
          // 判断删除的歌曲是否是当前正在播放的歌曲
          if(updataList[i].id==this.currentSong.id && item.id == this.currentSong.id){
            // 是 则删除当前歌曲并播放下一曲
            this.$store.commit('setCurrentSong',updataList[i+1]);
            updataList.splice(i,1);
            this.$store.commit('setPlayList',updataList);
            return;
          }
          // 否则 则从列表中删除
          if(updataList[i].id == item.id){
            updataList.splice(i,1);
            this.$store.commit('setPlayList',updataList);
          }
        }
      },

      // 改变播放模式
      changMode(){
        let mode = this.playMode+1;
        mode = mode > 2 ? 0 : mode;
        // 设置播放模式
        this.playMode = mode;

        switch(this.playMode){
          case 0:
            break;
          case 1:
            // 单曲循环
            // 在歌曲结束方法end()中控制
            break;
          case 2:
            // 随机播放
            let list = randomArray.shuffle(this.playList);
            this.$store.commit('setPlayList',list);
            break;
        }
      }

    }

  }
</script>
