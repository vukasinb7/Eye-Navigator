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
    <div class="gaze-control-grid-container" id="gaze-control-favorites-container">
    </div>
</div>
</section>
`;

document.body.insertAdjacentHTML('beforeend', modalHtml);



document.querySelector('.custom-gaze-control-modal').addEventListener('click', function (e) {
  document.querySelector('.custom-gaze-control-modal').classList.remove('active');
  e.preventDefault();
});
