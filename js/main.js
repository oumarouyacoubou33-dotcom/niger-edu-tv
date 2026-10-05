import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAaO0fi15mPE-IwRO2ii7-cJjXzWz4eeO4",
  authDomain: "niger-edu-tv.firebaseapp.com",
  projectId: "niger-edu-tv",
  storageBucket: "niger-edu-tv.firebasestorage.app",
  messagingSenderId: "424180598206",
  appId: "1:424180598206:web:97cc0141e78e596c07a5ef",
  measurementId: "G-SD9D7CX0BX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadNews() {
    const newsGrid = document.getElementById('news-grid');
    if (!newsGrid) return;

    try {
        const querySnapshot = await getDocs(collection(db, "actualites"));
        if (querySnapshot.empty) {
            newsGrid.innerHTML = '<p>Aucun article disponible pour le moment.</p>';
            return;
        }

        let html = '';
        querySnapshot.forEach((docSnap) => {
            const article = docSnap.data();
            html += `
                <article class="news-card">
                    <img src="${article.imageUrl}" alt="${article.title}" onerror="this.src='https://via.placeholder.com/600x400?text=Niger+Edu+TV'">
                    <div class="news-content">
                        <span class="category">${article.category || 'Éducation'}</span>
                        <h3>${article.title}</h3>
                        <p>${article.content.substring(0, 100)}...</p>
                        <small style="color:#888; display:block; margin-top:5px;">📅 ${article.date || ''}</small>
                    </div>
                </article>
            `;
        });
        newsGrid.innerHTML = html;
    } catch (e) {
        newsGrid.innerHTML = '<p>Erreur lors du chargement des actualités.</p>';
    }
}

async function loadVideos() {
    const videoGrid = document.getElementById('video-grid');
    if (!videoGrid) return;

    try {
        const querySnapshot = await getDocs(collection(db, "videos"));
        if (querySnapshot.empty) {
            videoGrid.innerHTML = '<p>Aucune vidéo disponible pour le moment.</p>';
            return;
        }

        let html = '';
        querySnapshot.forEach((docSnap) => {
            const video = docSnap.data();
            html += `
                <div class="video-card" style="margin-bottom: 20px; background: white; padding: 10px; border-radius: 8px;">
                    <iframe width="100%" height="220" src="${video.videoUrl}" frameborder="0" allowfullscreen style="border-radius:6px;"></iframe>
                    <h4 style="margin-top: 10px;">${video.title}</h4>
                </div>
            `;
        });
        videoGrid.innerHTML = html;
    } catch (e) {
        videoGrid.innerHTML = '<p>Erreur lors du chargement des vidéos.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadNews();
    loadVideos();
});
