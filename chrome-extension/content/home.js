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

const style = document.createElement('style');
style.textContent = `
.custom-gaze-control-modal {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  margin-top: 0;
  padding-top:70px;
  display: flex;
  justify-content: center;
  background-color: rgba(7, 15, 43, 0.85);
  backdrop-filter: blur(10px);
}

.custom-gaze-control-modal {
  z-index: 100000000;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.5s, visibility 0s 0.5s;
}

.custom-gaze-control-modal.active {
  opacity: 1;
  visibility: visible;
  transition: opacity 0.5s;
}
.gaze-control-container {
    width: 80%;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.gaze-control-fav-card {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-style: italic;
    width: 140px;
    height: 140px;
    rgba(7, 15, 43, 0.8)
    backdrop-filter: blur(10px);
    margin: 25px;
}
.gaze-control-fav-card p{
    color: black;
}

.gaze-control-fav-card img {
    margin-top: 15px;
    width: 60px;
    height: 60px;
}

.gaze-control-search {
    width: 100%;
    min-width: 450px;
    display: flex;
    justify-content:between;
    align-items:center;
}

.gaze-control-search input {
    font-size: 40px;
    height:100%;
}

.gaze-control-searchTerm {
    width: 100%;
    border: 3px solid #9290C3;
    border-radius: 5px;
    outline: none;
    color: #9290C3;

}

.gaze-control-searchTerm:focus {
    color: #9290C3;
}

.gaze-control-searchButton {
    width: 66px;
    min-width:66px;
    height: 66px;
    border: 1px solid #9290C3;
    background: #9290C3;
    text-align: center;
    color: #fff;
    border-radius: 100px;
    cursor: pointer;
    font-size: 26px;
    display:flex;
    justify-content:center;
    align-items:center;
}

.gaze-control-wrap {
    width: 70%;
}

.gaze-control-grid-container {
    margin-top: 80px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
}

.gaze-control-search-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
`;
document.head.appendChild(style);


document.querySelector('.custom-gaze-control-modal').addEventListener('click', function (e) {
  document.querySelector('.custom-gaze-control-modal').classList.remove('active');
  e.preventDefault();
});
