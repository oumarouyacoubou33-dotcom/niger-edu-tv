const newsContainer = document.getElementById('news-container');
const videoContainer = document.getElementById('video-container');
let currentArticles = [];

function loadActualites(filterCategory = 'Toutes') {
    let actualites = JSON.parse(localStorage.getItem('actualites')) || [];
    currentArticles = actualites;

    if (filterCategory !== 'Toutes') {
        actualites = actualites.filter(item => item.category === filterCategory);
    }

    if (actualites.length === 0) {
        newsContainer.innerHTML = '<p style="grid-column: 1/-1; color: #777;">Aucune publication disponible.</p>';
        return;
    }

    let htmlContent = '';
    actualites.forEach((news) => {
        let badgeClass = news.category === 'Sport' ? 'sport' : (news.category === 'Divertissement' ? 'divertissement' : '');

        htmlContent += `
            <article class="news-card" onclick="openModal(${news.id})">
                <img src="${news.imageUrl}" alt="${news.title}" onerror="this.src='https://via.placeholder.com/300x180?text=Niger+Edu+TV'">
                <div class="news-card-content">
                    <span class="badge ${badgeClass}">${news.category || 'Éducation'}</span>
                    <h3>${news.title}</h3>
                    <p>${news.content.substring(0, 80)}...</p>
                </div>
            </article>
        `;
    });
    newsContainer.innerHTML = htmlContent;
}

function loadVideos() {
    let videos = JSON.parse(localStorage.getItem('videos')) || [];
    if (!videoContainer) return;

    if (videos.length === 0) {
        videoContainer.innerHTML = '<p style="grid-column: 1/-1; color: #777;">Aucune vidéo disponible pour le moment.</p>';
        return;
    }

    // Load first video by default
    playLocalVideo(videos[0].videoUrl, videos[0].title);

    let html = '';
    videos.forEach((vid, index) => {
        html += `
            <div class="news-card" onclick="playLocalVideo('${vid.videoUrl}', '${vid.title}')">
                <div style="position:relative; padding-bottom:56.25%; height:0; background:#111; display:flex; align-items:center; justify-content:center;">
                    <span style="position:absolute; top:40%; color:white; font-size:2rem;">▶</span>
                </div>
                <div class="news-card-content">
                    <span class="badge" style="background:#e05206; color:white;">VIDÉO LOCAL</span>
                    <h3>${vid.title}</h3>
                </div>
            </div>
        `;
    });
    videoContainer.innerHTML = html;
}

function playLocalVideo(url, title) {
    const videoPlayer = document.getElementById('mainVideoPlayer');
    const videoSource = document.getElementById('videoSource');
    const titleHeader = document.getElementById('mainVideoTitle');

    if (videoPlayer && videoSource) {
        videoSource.src = url;
        videoPlayer.load();
        if (titleHeader) titleHeader.innerText = title;
    }
}

function filterNews(category) {
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    if (event) event.target.classList.add('active');
    loadActualites(category);
}

function openModal(id) {
    const article = currentArticles.find(item => item.id === id);
    if (!article) return;
    document.getElementById('modalImage').src = article.imageUrl;
    document.getElementById('modalTitle').innerText = article.title;
    document.getElementById('modalDescription').innerText = article.content;
    document.getElementById('modalBadge').innerText = article.category || 'Éducation';
    document.getElementById('articleModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('articleModal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    if (newsContainer) loadActualites();
    if (videoContainer) loadVideos();
});
