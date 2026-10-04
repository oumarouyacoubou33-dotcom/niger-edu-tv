if (localStorage.getItem("isAdminLoggedIn") !== "true") {
    window.location.href = "login.html";
}

const newsForm = document.getElementById('add-news-form');
const videoForm = document.getElementById('add-video-form');
const adminNewsList = document.getElementById('admin-news-list');
const adminVideoList = document.getElementById('admin-video-list');

function displayAdminNews() {
    let actualites = JSON.parse(localStorage.getItem('actualites')) || [];
    if (actualites.length === 0) {
        adminNewsList.innerHTML = '<p style="color: #777;">Aucun article enregistré.</p>';
        return;
    }
    let html = '';
    actualites.forEach((item) => {
        html += `
            <div class="admin-item">
                <img src="${item.imageUrl}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/600x400?text=Image'">
                <div style="flex-grow: 1; margin-left: 10px;">
                    <strong style="display:block; font-size: 0.95rem;">${item.title}</strong>
                    <small style="color: #666;">${item.category || 'Éducation'}</small>
                </div>
                <button class="btn-delete" onclick="deleteArticle(${item.id})">Supprimer</button>
            </div>
        `;
    });
    adminNewsList.innerHTML = html;
}

function displayAdminVideos() {
    let videos = JSON.parse(localStorage.getItem('videos')) || [];
    if (videos.length === 0) {
        adminVideoList.innerHTML = '<p style="color: #777;">Aucune vidéo enregistrée.</p>';
        return;
    }
    let html = '';
    videos.forEach((item) => {
        html += `
            <div class="admin-item">
                <div style="flex-grow: 1;">
                    <strong style="display:block; font-size: 0.95rem;">${item.title}</strong>
                </div>
                <button class="btn-delete" onclick="deleteVideo(${item.id})">Supprimer</button>
            </div>
        `;
    });
    adminVideoList.innerHTML = html;
}

function deleteArticle(id) {
    if (confirm("Supprimer cet article ?")) {
        let actualites = JSON.parse(localStorage.getItem('actualites')) || [];
        actualites = actualites.filter(item => item.id !== id);
        localStorage.setItem('actualites', JSON.stringify(actualites));
        displayAdminNews();
    }
}

function deleteVideo(id) {
    if (confirm("Supprimer cette vidéo ?")) {
        let videos = JSON.parse(localStorage.getItem('videos')) || [];
        videos = videos.filter(item => item.id !== id);
        localStorage.setItem('videos', JSON.stringify(videos));
        displayAdminVideos();
    }
}

// Event Dora Bidiyo daga Storage
if (videoForm) {
    videoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('video-title').value;
        const videoInput = document.getElementById('video-file');

        if (!videoInput.files || !videoInput.files[0]) {
            alert("Veuillez sélectionner une vidéo.");
            return;
        }

        const file = videoInput.files[0];

        // Tabbatar girman bidiyo ba ya wuce 8MB ba
        if (file.size > 8 * 1024 * 1024) {
            alert("La vidéo est trop lourde pour le stockage local (Maximum 8 Mo). Veuillez choisir une vidéo plus courte.");
            return;
        }

        try {
            const videoDataUrl = await convertBase64(file);

            const newVideo = {
                id: Date.now(),
                title,
                videoUrl: videoDataUrl,
                isLocal: true
            };

            let videos = JSON.parse(localStorage.getItem('videos')) || [];
            videos.unshift(newVideo);
            localStorage.setItem('videos', JSON.stringify(videos));

            alert("Vidéo importée avec succès !");
            videoForm.reset();
            displayAdminVideos();
        } catch (err) {
            alert("Erreur lors du chargement de la vidéo. Espace mémoire saturé.");
        }
    });
}

// Convert File to Base64 String
function convertBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => resolve(fileReader.result);
        fileReader.onerror = (error) => reject(error);
    });
}

if (newsForm) {
    newsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('news-title').value;
        const category = document.getElementById('news-category').value;
        const content = document.getElementById('news-content').value;
        const fileInput = document.getElementById('news-image-file');
        const urlInput = document.getElementById('news-image-url').value;

        let imageUrl = urlInput;
        if (fileInput.files && fileInput.files[0]) {
            try {
                imageUrl = await convertBase64(fileInput.files[0]);
            } catch (err) {
                alert("Erreur d'image.");
                return;
            }
        }
        if (!imageUrl) imageUrl = 'https://via.placeholder.com/600x400?text=Niger+Edu+TV';

        const newArticle = { id: Date.now(), title, category, content, imageUrl, date: new Date().toLocaleDateString() };
        let actualites = JSON.parse(localStorage.getItem('actualites')) || [];
        actualites.unshift(newArticle);
        localStorage.setItem('actualites', JSON.stringify(actualites));

        alert('Article publié avec succès !');
        newsForm.reset();
        displayAdminNews();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (adminNewsList) displayAdminNews();
    if (adminVideoList) displayAdminVideos();
});
