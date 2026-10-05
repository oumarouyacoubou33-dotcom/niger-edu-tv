import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

if (localStorage.getItem("isAdminLoggedIn") !== "true") {
    window.location.href = "login.html";
}

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

const newsForm = document.getElementById('add-news-form');
const videoForm = document.getElementById('add-video-form');
const adminNewsList = document.getElementById('admin-news-list');
const adminVideoList = document.getElementById('admin-video-list');

async function displayAdminNews() {
    try {
        const q = query(collection(db, "actualites"));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            adminNewsList.innerHTML = '<p style="color: #777;">Aucun article enregistré.</p>';
            return;
        }
        let html = '';
        querySnapshot.forEach((docSnap) => {
            const item = docSnap.data();
            html += `
                <div class="admin-item">
                    <img src="${item.imageUrl}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/600x400?text=Image'">
                    <div style="flex-grow: 1; margin-left: 10px;">
                        <strong style="display:block; font-size: 0.95rem;">${item.title}</strong>
                        <small style="color: #666;">${item.category || 'Éducation'}</small>
                    </div>
                    <button class="btn-delete" onclick="deleteArticle('${docSnap.id}')">Supprimer</button>
                </div>
            `;
        });
        adminNewsList.innerHTML = html;
    } catch (e) {
        console.error("Erreur news: ", e);
    }
}

async function displayAdminVideos() {
    try {
        const q = query(collection(db, "videos"));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            adminVideoList.innerHTML = '<p style="color: #777;">Aucune vidéo enregistrée.</p>';
            return;
        }
        let html = '';
        querySnapshot.forEach((docSnap) => {
            const item = docSnap.data();
            html += `
                <div class="admin-item">
                    <div style="flex-grow: 1;">
                        <strong style="display:block; font-size: 0.95rem;">${item.title}</strong>
                    </div>
                    <button class="btn-delete" onclick="deleteVideo('${docSnap.id}')">Supprimer</button>
                </div>
            `;
        });
        adminVideoList.innerHTML = html;
    } catch (e) {
        console.error("Erreur videos: ", e);
    }
}

window.deleteArticle = async function(id) {
    if (confirm("Supprimer cet article ?")) {
        await deleteDoc(doc(db, "actualites", id));
        displayAdminNews();
    }
}

window.deleteVideo = async function(id) {
    if (confirm("Supprimer cette vidéo ?")) {
        await deleteDoc(doc(db, "videos", id));
        displayAdminVideos();
    }
}

function extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

if (newsForm) {
    newsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('news-title').value;
        const category = document.getElementById('news-category').value;
        const content = document.getElementById('news-content').value;
        const imageUrl = document.getElementById('news-image-url').value;

        try {
            await addDoc(collection(db, "actualites"), {
                title,
                category,
                content,
                imageUrl,
                createdAt: new Date().toISOString(),
                date: new Date().toLocaleDateString('fr-FR')
            });
            alert('Article publié avec succès sur Firebase !');
            newsForm.reset();
            displayAdminNews();
        } catch (err) {
            alert("Erreur lors de la publication : " + err.message);
        }
    });
}

if (videoForm) {
    videoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('video-title').value;
        const videoUrlInput = document.getElementById('video-url').value.trim();

        let embedUrl = videoUrlInput;
        const ytId = extractYouTubeId(videoUrlInput);
        if (ytId) {
            embedUrl = `https://www.youtube.com/embed/${ytId}`;
        }

        try {
            await addDoc(collection(db, "videos"), {
                title,
                videoUrl: embedUrl,
                createdAt: new Date().toISOString()
            });
            alert("Vidéo ajoutée avec succès sur Firebase !");
            videoForm.reset();
            displayAdminVideos();
        } catch (err) {
            alert("Erreur lors de l'ajout de la vidéo : " + err.message);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    displayAdminNews();
    displayAdminVideos();
});
