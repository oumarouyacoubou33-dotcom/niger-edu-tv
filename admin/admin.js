if (localStorage.getItem("isAdminLoggedIn") !== "true") {
    window.location.href = "login.html";
}

const newsForm = document.getElementById('add-news-form');
const adminNewsList = document.getElementById('admin-news-list');

// Function nuna labarai a Dashboard tare da option din cirewa
function displayAdminNews() {
    let actualites = JSON.parse(localStorage.getItem('actualites')) || [];

    if (actualites.length === 0) {
        adminNewsList.innerHTML = '<p style="color: #777;">Aucune publication enregistrée.</p>';
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

// Function cire/goge labari da hotonsa
function deleteArticle(id) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet article et son image ?")) {
        let actualites = JSON.parse(localStorage.getItem('actualites')) || [];
        actualites = actualites.filter(item => item.id !== id);
        localStorage.setItem('actualites', JSON.stringify(actualites));
        displayAdminNews();
        alert("Article supprimé avec succès !");
    }
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
                imageUrl = await compressImage(fileInput.files[0]);
            } catch (err) {
                alert("Erreur lors du traitement de l'image.");
                return;
            }
        }

        if (!imageUrl) {
            imageUrl = 'https://via.placeholder.com/600x400?text=Niger+Edu+TV';
        }

        const newArticle = {
            id: Date.now(),
            title,
            category,
            content,
            imageUrl,
            date: new Date().toLocaleDateString()
        };

        try {
            let actualites = JSON.parse(localStorage.getItem('actualites')) || [];
            actualites.unshift(newArticle);
            localStorage.setItem('actualites', JSON.stringify(actualites));

            alert('Publication réussie !');
            newsForm.reset();
            displayAdminNews();
        } catch (error) {
            alert('Le fichier est trop grand.');
        }
    });
}

function compressImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const maxWidth = 800;
                const scaleFactor = maxWidth / img.width;
                
                if (scaleFactor < 1) {
                    canvas.width = maxWidth;
                    canvas.height = img.height * scaleFactor;
                } else {
                    canvas.width = img.width;
                    canvas.height = img.height;
                }

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (adminNewsList) {
        displayAdminNews();
    }
});
