// Add the modal HTML dynamically
const modalHtml = `
<section class="custom-gaze-control-modal" id="custom-gaze-control-modal">
  <div class="gaze-control-container">
    <div class="gaze-control-search-container">
        <div class="gaze-control-wrap">
            <div class="gaze-control-search">
                <input type="text" class="gaze-control-searchTerm" placeholder="Search...">
                <div style="width: 50px;"></div>
                <button type="submit" class="gaze-control-searchButton">
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0,0,256,256">
                    <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.12,5.12)"><path d="M21,3c-9.39844,0 -17,7.60156 -17,17c0,9.39844 7.60156,17 17,17c3.35547,0 6.46094,-0.98437 9.09375,-2.65625l12.28125,12.28125l4.25,-4.25l-12.125,-12.09375c2.17969,-2.85937 3.5,-6.40234 3.5,-10.28125c0,-9.39844 -7.60156,-17 -17,-17zM21,7c7.19922,0 13,5.80078 13,13c0,7.19922 -5.80078,13 -13,13c-7.19922,0 -13,-5.80078 -13,-13c0,-7.19922 5.80078,-13 13,-13z"></path></g></g>
                  </svg>
                </button>
            </div>
        </div>
    </div>
    <div class="gaze-control-grid-container-wrapper">
    
        <div class="gaze-control-grid-container" id="gaze-control-favorites-container">
        </div>
        <a id="add-bookmark-button">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="80" height="80" viewBox="0,0,256,256">
            <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(8.53333,8.53333)"><path d="M15,3c-6.627,0 -12,5.373 -12,12c0,6.627 5.373,12 12,12c6.627,0 12,-5.373 12,-12c0,-6.627 -5.373,-12 -12,-12zM21,16h-5v5c0,0.553 -0.448,1 -1,1c-0.552,0 -1,-0.447 -1,-1v-5h-5c-0.552,0 -1,-0.447 -1,-1c0,-0.553 0.448,-1 1,-1h5v-5c0,-0.553 0.448,-1 1,-1c0.552,0 1,0.447 1,1v5h5c0.552,0 1,0.447 1,1c0,0.553 -0.448,1 -1,1z"></path></g></g>
          </svg>
          <p>Add Current Page</p>
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
            link.href = bookmark.url;
            const favCard = document.createElement('div');
            favCard.className = 'gaze-control-fav-card';

            const img = document.createElement('img');
            img.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
            img.alt = 'website-img';

            const name = document.createElement('p');
            name.textContent = bookmark.title.length > 23?bookmark.title.slice(0, 23) + '...':bookmark.title;

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
        const bookmarks = result.savedBookmarks || []; // Get existing bookmarks or initialize an empty array

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


document.body.insertAdjacentHTML('beforeend', modalHtml);
document.getElementById('add-bookmark-button').addEventListener('click', addCurrentPageToBookmarks);
loadBookmarks();

