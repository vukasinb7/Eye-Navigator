// Add the modal HTML dynamically
const modalHtml = `
<section class="custom-gaze-control-modal" id="custom-gaze-control-modal">
  <div class="gaze-control-container">
    <div class="gaze-control-search-container">
        <div class="gaze-control-wrap">
            <div class="gaze-control-search">
                <input id="gaze-control-home-input" type="text" class="gaze-control-searchTerm" placeholder="Search...">
                <div style="width: 50px;"></div>
                <button type="submit" id="gaze-control-searchButton" class="gaze-control-searchButton">
                ${searchSVG()}
                  
                </button>
            </div>
        </div>
    </div>
    <div style="display: flex;justify-content: end;align-items: center;flex-direction: row;">
        <a id="custom-gaze-edit-bookmark-button">
         <div id="custom-gaze-edit-bookmark-edit-icon">
          ${editSVG()}
         </div>
         <div id="custom-gaze-edit-bookmark-done-icon" style="display: none;">
          ${doneSVG()}
         </div>
          <p>Edit</p>
      </a>
    </div>
    <div class="gaze-control-grid-container-wrapper">
        <div class="gaze-control-grid-container" id="gaze-control-favorites-container">
        </div>
        <a id="add-bookmark-button-link" style="border: 2px solid transparent;">
            <div id="add-bookmark-button">
              ${plusSVG()}
              <p>Add Current Page</p>
            </div>
        </a>
    </div>
</div>
</section>
`;

function loadBookmarks() {

    chrome.storage.local.get(['gazeControlBookmarks'], (result) => {
        const bookmarks = result.gazeControlBookmarks || [];
        console.log(bookmarks);
        const container = document.getElementById('gaze-control-favorites-container');
        container.innerHTML = '';

        bookmarks.forEach(bookmark => {
            const domain = new URL(bookmark.url).hostname;
            const link = document.createElement('a');
            link.addEventListener('click', () => {
                if (document.getElementById('custom-gaze-edit-bookmark-button').innerText === 'Edit') {
                    window.open(bookmark.url);
                } else {
                    chrome.storage.local.get(['gazeControlBookmarks'], (result) => {
                        const bookmarks = result.gazeControlBookmarks || [];
                        const updatedBookmarks = bookmarks.filter(item => item.url !== bookmark.url);

                        chrome.storage.local.set({gazeControlBookmarks: updatedBookmarks}, () => {
                            console.log('Bookmark removed successfully:', bookmark.url);
                            loadBookmarks();
                        });
                    });
                }
            });
            link.style.border = '2px solid transparent';

            const favCard = document.createElement('div');
            favCard.className = 'gaze-control-fav-card';

            const img = document.createElement('img');
            img.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
            img.alt = 'website-img';
            img.className = 'gaze-control-card-thumb';

            const name = document.createElement('p');
            name.textContent = bookmark.title.length > 23 ? bookmark.title.slice(0, 23) + '...' : bookmark.title;

            const closeIcon = document.createElement('div');
            closeIcon.innerHTML = closeSVG();
            closeIcon.className = 'gaze-control-card-close';

            let editBtn = document.querySelector('#custom-gaze-edit-bookmark-button p');
            if (editBtn.textContent === 'Edit') {
                closeIcon.style.display = 'none';
            } else {
                img.style.display = 'none';
            }

            favCard.appendChild(closeIcon);
            favCard.appendChild(img);
            favCard.appendChild(name);

            link.appendChild(favCard);
            container.appendChild(link);
        });
    });
}

function addCurrentPageToBookmarks() {
    const currentPageTitle = document.title; // Page title
    const currentPageURL = window.location.href; // Page URL

    chrome.storage.local.get(['gazeControlBookmarks'], (result) => {
        const bookmarks = result.gazeControlBookmarks || []; // Get existing bookmarks or initialize an empty array

        bookmarks.push({
            title: currentPageTitle,
            url: currentPageURL
        });

        chrome.storage.local.set({gazeControlBookmarks: bookmarks}, () => {
            console.log('Bookmark added successfully:', {title: currentPageTitle, url: currentPageURL});
            loadBookmarks();
        });
    });
}

function switchMode() {
    let editBtn = document.querySelector('#custom-gaze-edit-bookmark-button p');
    let bookmarkBtn = document.getElementById('add-bookmark-button');
    let bookmarkEditIcon = document.getElementById('custom-gaze-edit-bookmark-edit-icon');
    let bookmarkDoneIcon = document.getElementById('custom-gaze-edit-bookmark-done-icon');
    const cardsThumb = document.querySelectorAll('.gaze-control-card-thumb');
    const cardsClose = document.querySelectorAll('.gaze-control-card-close');
    if (editBtn.textContent === 'Edit') {

        //Change Button
        editBtn.innerText = 'Done';
        bookmarkEditIcon.style.display = 'none';
        bookmarkDoneIcon.style.display = 'flex';

        //Change Cards
        for (let i = 0; i < cardsThumb.length; i++) {
            cardsThumb[i].style.display = 'none';
            cardsClose[i].style.display = 'flex';
        }

        //Remove Add Card
        bookmarkBtn.style.display = 'none';
    } else {
        //Change Button
        editBtn.innerText = 'Edit';
        bookmarkEditIcon.style.display = 'flex';
        bookmarkDoneIcon.style.display = 'none';

        //Change Cards
        for (let i = 0; i < cardsThumb.length; i++) {
            cardsThumb[i].style.display = 'flex';
            cardsClose[i].style.display = 'none';
        }

        //Remove Add Card
        bookmarkBtn.style.display = 'flex';

    }
}

function search() {
    const query = document.querySelector("#gaze-control-home-input").value;
    if (query !== '') {
        const url = 'http://www.google.com/search?q=' + encodeURIComponent(query);
        const modal = document.querySelector('.custom-gaze-control-modal');
        modal.classList.toggle('active');
        location.href=url;
    }
}


document.body.insertAdjacentHTML('beforeend', modalHtml);
document.getElementById('add-bookmark-button-link').addEventListener('click', addCurrentPageToBookmarks);
document.getElementById('custom-gaze-edit-bookmark-button').addEventListener('click', switchMode);
document.getElementById('gaze-control-searchButton').addEventListener('click', search);
loadBookmarks();

