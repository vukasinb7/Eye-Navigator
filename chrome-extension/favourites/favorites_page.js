async function loadFavorites() {
        try {
            chrome.storage.sync.get(['favorites'], (result) => {
                const urls = result.favorites || [];

                const container = document.getElementById('favorites-container');
                container.innerHTML = '';

                urls.forEach(url => {
                    const domain = new URL(url).hostname;
                    const link = document.createElement('a');
                    link.href = url;
                    link.target = '_blank';
                    const favCard = document.createElement('div');
                    favCard.className = 'fav-card';

                    const img = document.createElement('img');
                    img.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
                    img.alt = 'website-img';

                    const name = document.createElement('p');
                    name.textContent = domain;

                    favCard.appendChild(img);
                    favCard.appendChild(name);

                    link.appendChild(favCard);
                    container.appendChild(link);
                });
            });
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
    }

    loadFavorites();