const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
let songNumbers = [];
let songsPlayedOnce = [];
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
  currentIndex: 0,
  currentTimeAudio: 0,
  audioDuration: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  songs: [
    {
      name: '3107 3',
      singer: 'W/n - ft. Nâu, Duong',
      path: './assets/music/31073.mp3',
      image: './assets/img/31073.jpeg',
    },

    {
      name: 'Anh Đánh Rơi Người Yêu Này',
      singer: 'Andiez - ft. AMEE',
      path: './assets/music/AnhDanhRoiNguoiYeuNay.mp3',
      image: './assets/img/AnhDanhRoiNguoiYeuNay.jpeg',
    },

    {
      name: 'Girls Like You',
      singer: 'Maroon 5 - ft. Cardi B',
      path: './assets/music/GirlsLikeYou.mp3',
      image: './assets/img/GirlsLikeYou.jpeg',
    },

    {
      name: 'Goodbye',
      singer: 'DIA - 안녕',
      path: './assets/music/Goodbye.mp3',
      image: './assets/img/Goodbye.jpeg',
    },

    {
      name: 'Sau Lời Khước Từ',
      singer: 'Phan Mạnh Quỳnh',
      path: './assets/music/SauLoiKhuocTu.mp3',
      image: './assets/img/SauLoiKhuocTu.jpg',
    },

    {
      name: 'Vây Giữ',
      singer: 'Vương Tĩnh Văn',
      path: './assets/music/VayGiu.mp3',
      image: './assets/img/VayGiu.jpeg',
    },

    {
      name: 'Sau Khi Anh Đi',
      singer: 'Tiểu Mị',
      path: './assets/music/SauKhiAnhDi.mp3',
      image: './assets/img/SauKhiAnhDi.jpeg',
    },

    {
      name: 'Let Me Down Slowly',
      singer: 'Alec Benjamin',
      path: './assets/music/LetMeDownSlowly.mp3',
      image: './assets/img/LetMeDownSlowly.jpeg',
    },

    {
      name: 'La La La',
      singer: 'Sam Smith',
      path: './assets/music/LaLaLa.mp3',
      image: './assets/img/LaLaLa.jpeg',
    },

    {
      name: 'Đáy Biển',
      singer: 'Nhất Chi Lựu Liên',
      path: './assets/music/DayBien.mp3',
      image: './assets/img/DayBien.jpeg',
    },

    {
      name: 'Bước Qua Mùa Cô Đơn',
      singer: 'Vũ',
      path: './assets/music/BuocQuaMuaCoDon.mp3',
      image: './assets/img/BuocQuaMuaCoDon.jpeg',
    },
  ],

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
      <div class="song ${
        index === this.currentIndex ? 'active' : ''
      }" data-index="${index}">
        <div
          class="thumb"
          style="
            background-image: url('${song.image}');
          "></div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
    </div>`;
    });

    $('.playlist').innerHTML = htmls.join('');
  },

  defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.clientWidth;

    // Xử lý khi CD quay / dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: 'rotate(360deg)' }], {
      duration: 10000,
      interations: Infinity, // lặp vô hạn
      easing: 'ease-out', // tốc độ quay
    });

    cdThumbAnimate.pause();

    // Xử lý phóng to / thu nhỏ CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? Math.floor(newCdWidth) + 'px' : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    //Xử lý khi click controls (play/pause)
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        if (_this.currentTimeAudio > 0) {
          audio.currentTime = _this.currentTimeAudio;
        }
        audio.play();
      }
    };

    // Xử lý khi song được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add('playing');

      cdThumbAnimate.effect.updateTiming({
        duration: audio.duration * 1000, // thời gian quay
      });
      cdThumbAnimate.play();
    };

    // xử lý khi song được pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove('playing');
      cdThumbAnimate.pause();
    };

    //Xử lý khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const propgressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = propgressPercent;
      }
    };

    // Xử lý khi tua song
    progress.oninput = function (e) {
      const seekTime = (e.target.value / 100) * audio.duration;
      audio.currentTime = seekTime;
      cdThumbAnimate.currentTime = audio.currentTime * 1000;
    };

    // Xử lý khi next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandom();
      } else {
        _this.nextSong();
      }

      audio.addEventListener('loadedmetadata', function () {
        cdThumbAnimate.effect.updateTiming({
          duration: audio.duration * 1000, // thời gian quay
        });

        $('.song.active').classList.remove('active');
        $$('.song')[_this.currentIndex].classList.add('active');

        _this.scrollToActiveSong();
        audio.play();
      });
    };

    // Xử lý khi prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandom();
      } else {
        _this.prevSong();
      }

      audio.addEventListener('loadedmetadata', function () {
        cdThumbAnimate.effect.updateTiming({
          duration: audio.duration * 1000, // thời gian quay
        });

        $('.song.active').classList.remove('active');
        $$('.song')[_this.currentIndex].classList.add('active');

        audio.play();
      });
    };

    // Xử lý khi bật / tắt random song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig('isRandom', _this.isRandom);
      randomBtn.classList.toggle('active', _this.isRandom);
    };

    // xử lý khi next song khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Xử lý lặp lại một song
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig('isRepeat', _this.isRepeat);
      repeatBtn.classList.toggle('active', _this.isRepeat);
    };

    // Lắng nghe hành vi click vào playlist
    playlist.onclick = function (e) {
      const songElement = e.target.closest('.song:not(.active)');
      const optionIcon = e.target.closest('.option');
      if (songElement || optionIcon) {
        // xử lý khi click vào song option
        if (optionIcon) {
        }

        // xử lý khi click vào song
        if (songElement) {
          _this.currentIndex = Number(songElement.dataset.index);
          _this.loadCurrentSong();

          audio.addEventListener('loadedmetadata', function () {
            cdThumbAnimate.effect.updateTiming({
              duration: audio.duration * 1000, // thời gian quay
            });

            $('.song.active').classList.remove('active');
            const addClassActive = $$('.song')[_this.currentIndex];
            addClassActive.classList.add('active');

            audio.play();
          });
        }
      }
    };

    // xử lý hành vi khi reload lại web
    window.onbeforeunload = function () {
      const indexSongActive = Number($('.song.active').dataset.index);
      _this.setConfig('currentIndex', indexSongActive);

      _this.setConfig('currentTime', audio.currentTime);
      _this.setConfig('audioDuration', audio.duration);
    };
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
    progress.value = Math.floor(
      (this.currentTimeAudio / this.audioDuration) * 100
    );
  },

  loadConfig: function () {
    this.isRandom = this.config.isRandom === true ? true : false;
    this.isRepeat = this.config.isRepeat === true ? true : false;
    this.currentIndex =
      this.config.currentIndex > 0 ? this.config.currentIndex : 0;
    this.currentTimeAudio =
      this.config.currentTime > 0 ? this.config.currentTime : 0;
    this.audioDuration =
      this.config.audioDuration > 0 ? this.config.audioDuration : 0;
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }

    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }

    this.loadCurrentSong();
  },

  playRandom: function () {
    let newIndex;
    songNumbers = this.songs.map((song, index) => {
      return index;
    });

    if (songsPlayedOnce.length === 0) {
      songsPlayedOnce.push(this.currentIndex);
    }

    if (songNumbers.length === songsPlayedOnce.length) {
      songsPlayedOnce.splice(0, songsPlayedOnce.length);
    }

    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (songsPlayedOnce.includes(newIndex));

    songsPlayedOnce.push(newIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  scrollToActiveSong: function () {
    $('.song.active').scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  },

  start: function () {
    // Gán cấu hình từ config vào ứng dụng
    this.loadConfig();

    // Định nghĩa các thuộc tính cho object
    this.defineProperties();

    // Lắng nghe / xử lý sự kiện (DOM Events)
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    // Render playlist
    this.render();

    // hiển thị trạng thái ban đầu cảu button reepeat & random
    randomBtn.classList.toggle('active', this.isRandom);
    repeatBtn.classList.toggle('active', this.isRepeat);
  },
};

app.start();
