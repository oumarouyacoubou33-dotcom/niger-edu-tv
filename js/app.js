const newsContainer = document.getElementById('news-container');
let currentArticles = [];

function loadActualites(filterCategory = 'Toutes') {
    let actualites = JSON.parse(localStorage.getItem('actualites')) || [];
    currentArticles = actualites;

    if (filterCategory !== 'Toutes') {
        actualites = actualites.filter(item => item.category === filterCategory);
    }

    if (actualites.length === 0) {
        newsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #777; padding: 20px;">Aucune publication disponible dans cette catégorie.</p>';
        return;
    }

    let htmlContent = '';
    actualites.forEach((news, index) => {
        let badgeClass = '';
        if (news.category === 'Sport') badgeClass = 'sport';
        else if (news.category === 'Divertissement') badgeClass = 'divertissement';
        else if (news.category === 'Interview') badgeClass = 'interview';

        htmlContent += `
            <article class="news-card" onclick="openModal(${news.id})">
                <img src="${news.imageUrl}" alt="${news.title}" onerror="this.src='https://via.placeholder.com/300x180?text=Niger+Edu+TV'">
                <div class="news-card-content">
                    <span class="badge ${badgeClass}">${news.category || 'Éducation'}</span>
                    <h3>${news.title}</h3>
                    <p>${news.content.substring(0, 90)}...</p>
                </div>
            </article>
        `;
    });

    newsContainer.innerHTML = htmlContent;
}

function filterNews(category) {
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    if (event) {
        event.target.classList.add('active');
    }
    loadActualites(category);
}

// Bude Modal din karanta labari da girma
function openModal(id) {
    const article = currentArticles.find(item => item.id === id);
    if (!article) return;

    document.getElementById('modalImage').src = article.imageUrl;
    document.getElementById('modalTitle').innerText = article.title;
    document.getElementById('modalDescription').innerText = article.content;
    
    const badge = document.getElementById('modalBadge');
    badge.innerText = article.category || 'Éducation';

    document.getElementById('articleModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('articleModal').style.display = 'none';
}

// Rufe Modal din idan an danna wajenta
window.onclick = function(event) {
    const modal = document.getElementById('articleModal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (newsContainer) {
        loadActualites();
    }
});
