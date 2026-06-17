<script>
const tracks = [
  { title: "Midnight Drive", artist: "Nova Sound", album: "Neon Nights", duration: "3:42", cover: "https://picsum.photos/seed/track1/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title: "Golden Hour", artist: "Lia Park", album: "Sunset Sessions", duration: "4:01", cover: "https://picsum.photos/seed/track2/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { title: "Static Bloom", artist: "Echo Ridge", album: "Frequencies", duration: "2:58", cover: "https://picsum.photos/seed/track3/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { title: "Paper Planes", artist: "Nova Sound", album: "Neon Nights", duration: "3:15", cover: "https://picsum.photos/seed/track4/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { title: "Slow Burn", artist: "Quiet Atlas", album: "Embers", duration: "3:50", cover: "https://picsum.photos/seed/track5/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  { title: "City Lights", artist: "Lia Park", album: "Sunset Sessions", duration: "3:33", cover: "https://picsum.photos/seed/track6/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" }
];

const playlists = [
  { name: "Daily Mix 1", sub: "Made for you", art: "https://picsum.photos/seed/playlist1/300/300", yt: "https://www.youtube.com/results?search_query=daily+mix+playlist" },
  { name: "Liked Songs", sub: "Your favorites", art: "https://picsum.photos/seed/playlist2/300/300", yt: "https://www.youtube.com/results?search_query=liked+songs+playlist" },
  { name: "Chill Mix", sub: "Relax & unwind", art: "https://picsum.photos/seed/playlist3/300/300", yt: "https://www.youtube.com/watch?v=eoXtKw_bW_s" },
  { name: "Focus Flow", sub: "Deep concentration", art: "https://picsum.photos/seed/playlist4/300/300", yt: "https://www.youtube.com/results?search_query=focus+flow+study+music+playlist" },
  { name: "Road Trip", sub: "Drive playlist", art: "https://picsum.photos/seed/playlist5/300/300", yt: "https://www.youtube.com/results?search_query=road+trip+music+playlist" },
];

let currentIndex = -1;
let isPlaying = false;
let likedTracks = new Set();

const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const playerArt = document.getElementById('playerArt');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const progressFill = document.getElementById('progressFill');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const likeBtn = document.getElementById('likeBtn');
const volumeBar = document.getElementById('volumeBar');
const volumeFill = document.getElementById('volumeFill');

const cardGrid = document.getElementById('cardGrid');
playlists.forEach(p => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="art" style="background-image:url('${p.art}')"></div>
    <p class="title">${p.name}</p>
    <p class="sub">${p.sub}</p>
  `;
  card.addEventListener('click', () => window.open(p.yt, '_blank', 'noopener'));
  cardGrid.appendChild(card);
});

const trackList = document.getElementById('trackList');

function renderTracks(list) {
  trackList.innerHTML = '';
  list.forEach((track, i) => {
    const row = document.createElement('div');
    row.className = 'track-row';
    if (i === currentIndex) row.classList.add('playing');
    row.innerHTML = `
      <div class="track-art" style="background-image:url('${track.cover}')"></div>
      <div class="track-info">
        <div class="t-title">${track.title}</div>
        <div class="t-artist">${track.artist}</div>
      </div>
      <div class="track-duration">${track.duration}</div>
    `;
    row.addEventListener('click', () => playTrack(i));
    trackList.appendChild(row);
  });
}
renderTracks(tracks);

function playTrack(index) {
  currentIndex = index;
  const track = tracks[index];

  audio.src = track.audioUrl;
  audio.play().catch(() => {});

  playerArt.style.backgroundImage = `url('${track.cover}')`;
  playerTitle.textContent = track.title;
  playerArtist.textContent = track.artist;

  isPlaying = true;
  playBtn.textContent = '⏸️';

  likeBtn.classList.toggle('liked', likedTracks.has(index));
  likeBtn.textContent = likedTracks.has(index) ? '♥' : '♡';

  renderTracks(tracks);
}

function togglePlay() {
  if (currentIndex === -1) {
    playTrack(0);
    return;
  }
  if (isPlaying) {
    audio.pause();
    playBtn.textContent = '▶️';
  } else {
    audio.play();
    playBtn.textContent = '⏸️';
  }
  isPlaying = !isPlaying;
}

function nextTrack() {
  if (currentIndex === -1) return playTrack(0);
  playTrack((currentIndex + 1) % tracks.length);
}

function prevTrack() {
  if (currentIndex === -1) return playTrack(0);
  playTrack((currentIndex - 1 + tracks.length) % tracks.length);
}

playBtn.addEventListener('click', togglePlay);
document.getElementById('nextBtn').addEventListener('click', nextTrack);
document.getElementById('prevBtn').addEventListener('click', prevTrack);

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = pct + '%';
  currentTimeEl.textContent = formatTime(audio.currentTime);
  totalTimeEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
  nextTrack();
});

progressBar.addEventListener('click', (e) => {
  if (!audio.duration) return;
  const rect = progressBar.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
});

function formatTime(sec) {
  if (isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

audio.volume = 0.7;
volumeBar.addEventListener('click', (e) => {
  const rect = volumeBar.getBoundingClientRect();
  const pct = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
  audio.volume = pct;
  volumeFill.style.width = (pct * 100) + '%';
});

likeBtn.addEventListener('click', () => {
  if (currentIndex === -1) return;
  if (likedTracks.has(currentIndex)) {
    likedTracks.delete(currentIndex);
    likeBtn.classList.remove('liked');
    likeBtn.textContent = '♡';
  } else {
    likedTracks.add(currentIndex);
    likeBtn.classList.add('liked');
    likeBtn.textContent = '♥';
  }
});

document.getElementById('searchInput').addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  const filtered = tracks.filter(t =>
    t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q)
  );
  renderTracks(filtered);
});

document.querySelectorAll('.playlist-item[data-yt]').forEach(item => {
  item.addEventListener('click', () => window.open(item.dataset.yt, '_blank', 'noopener'));
});

/* ---- Ad behavior ---- */
const bannerAd = document.getElementById('bannerAd');
document.getElementById('bannerAdClose').addEventListener('click', (e) => {
  e.stopPropagation();
  bannerAd.style.display = 'none';
});

const popupOverlay = document.getElementById('popupOverlay');
function showPopupAd() {
  popupOverlay.classList.add('show');
}
function hidePopupAd() {
  popupOverlay.classList.remove('show');
}
document.getElementById('popupClose').addEventListener('click', hidePopupAd);
document.getElementById('popupClose2').addEventListener('click', hidePopupAd);
popupOverlay.addEventListener('click', (e) => {
  if (e.target === popupOverlay) hidePopupAd();
});
document.getElementById('sidebarAdBtn').addEventListener('click', showPopupAd);

// Show an ad popup shortly after load, then again every couple of track changes
setTimeout(showPopupAd, 8000);
let playsSinceAd = 0;
const originalPlayTrack = playTrack;
playTrack = function(index) {
  originalPlayTrack(index);
  playsSinceAd++;
  if (playsSinceAd >= 3) {
    playsSinceAd = 0;
    showPopupAd();
  }
};

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    const view = item.dataset.view;
    if (view === 'home') {
      document.getElementById('contentTitle').textContent = 'Good evening';
      cardGrid.style.display = 'grid';
      renderTracks(tracks);
    } else if (view === 'search') {
      document.getElementById('contentTitle').textContent = 'Search';
      cardGrid.style.display = 'none';
      renderTracks(tracks);
    } else if (view === 'liked') {
      document.getElementById('contentTitle').textContent = 'Liked Songs';
      cardGrid.style.display = 'none';
      renderTracks(tracks.filter((_, i) => likedTracks.has(i)));
    }
  });
});
</script>
