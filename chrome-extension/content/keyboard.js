const kayboardModalHtml = `
<section class="custom-gaze-control-keyboard-modal" id="custom-gaze-control-keyboard-modal">
  <div class="custom-gaze-keyboard">
    <div class="row">
        <label>
            <input type="text" class="custom-gaze-input"/>
        </label>
    </div>
    <div class="row">
        <a class="single-button alphabetical">
            <p>q</p>
        </a>
        <a class="single-button alphabetical">
            <p>w</p>
        </a>
        <a class="single-button alphabetical">
            <p>e</p>
        </a>
        <a class="single-button alphabetical">
            <p>r</p>
        </a>
        <a class="single-button alphabetical">
            <p>t</p>
        </a>
        <a class="single-button alphabetical">
            <p>y</p>
        </a>
        <a class="single-button alphabetical">
            <p>u</p>
        </a>
        <a class="single-button alphabetical">
            <p>i</p>
        </a>
        <a class="single-button alphabetical">
            <p>o</p>
        </a>
        <a class="single-button alphabetical">
            <p>p</p>
        </a>
    </div>
    <div class="row">
        <a class="single-button alphabetical">
            <p>a</p>
        </a>
        <a class="single-button alphabetical">
            <p>s</p>
        </a>
        <a class="single-button alphabetical">
            <p>d</p>
        </a>
        <a class="single-button alphabetical">
            <p>f</p>
        </a>
        <a class="single-button alphabetical">
            <p>g</p>
        </a>
        <a class="single-button alphabetical">
            <p>h</p>
        </a>
        <a class="single-button alphabetical">
            <p>j</p>
        </a>
        <a class="single-button alphabetical">
            <p>k</p>
        </a>
        <a class="single-button alphabetical">
            <p>l</p>
        </a>
    </div>
    <div class="row">

        <a class="double-button caps-lock">
            <div style="display: flex;justify-content: center;align-items: center;flex-direction: row; margin: 0 10px;">
                <div class="custom-gaze-keyboard-caps-lock-on">${capsLockOnSVG()}</div>
                <div class="custom-gaze-keyboard-caps-lock-off">${capsLockOffSVG()}</div>
                <p>CAPS LOCK</p>
            </div>
        </a>
        <a class="single-button alphabetical">
            <p>z</p>
        </a>
        <a class="single-button alphabetical">
            <p>x</p>
        </a>
        <a class="single-button alphabetical">
            <p>c</p>
        </a>
        <a class="single-button alphabetical">
            <p>v</p>
        </a>
        <a class="single-button alphabetical">
            <p>b</p>
        </a>
        <a class="single-button alphabetical">
            <p>n</p>
        </a>
        <a class="single-button alphabetical">
            <p>m</p>
        </a>
        <a class="double-button backspace">
            ${backspaceSVG()}
        </a>
    </div>
    <div class="row">

        <a class="double-button cancel">
            <div style="display: flex;justify-content: center;align-items: center;flex-direction: row; margin: 0 10px;">
                <div >${closeBlackSVG()}</div>
                <p>CANCEL</p>
            </div>
        </a>
        <a class="single-button spec-char">
            <p>,</p>
        </a>

        <a class="space spec-char">
            <p> </p>
        </a>

        <a class="single-button spec-char">
            <p>.</p>
        </a>
        <a class="double-button enter">
            <div style="display: flex;justify-content: center;align-items: center;flex-direction: row; margin: 0 10px;">
                <div>${doneBlackSVG()}</div>
                <p>ENTER</p>
            </div>
        </a>
    </div>
</div>
</section>
`;
document.body.insertAdjacentHTML('beforeend', kayboardModalHtml);

const customInput = document.querySelector('.custom-gaze-keyboard .custom-gaze-input')
document.querySelector(".custom-gaze-keyboard .caps-lock").addEventListener('click', () => {
    if (document.querySelector(".custom-gaze-keyboard-caps-lock-on").style.display === 'none') {
        document.querySelector(".custom-gaze-keyboard-caps-lock-on").style.display = 'none';
        document.querySelector(".custom-gaze-keyboard-caps-lock-off").style.display = 'flex';
    } else {
        document.querySelector(".custom-gaze-keyboard-caps-lock-on").style.display = 'flex';
        document.querySelector(".custom-gaze-keyboard-caps-lock-off").style.display = 'none';
    }
    document.querySelectorAll(".custom-gaze-keyboard .alphabetical p").forEach((p) => {
        const currentText = p.textContent;
        if (currentText === currentText.toUpperCase()) {
            p.textContent = currentText.toLowerCase();
        } else {
            p.textContent = currentText.toUpperCase();
        }
    });
})
document.querySelector(".custom-gaze-keyboard .backspace").addEventListener('click', () => {
    customInput.value = customInput.value.length > 0 ? customInput.value.slice(0, customInput.value.length - 1) : '';
})

document.querySelector(".custom-gaze-keyboard .enter").addEventListener('click', () => {
    inputClickedElement.value = customInput.value;
    customInput.value = '';
    const modal = document.querySelector('.custom-gaze-control-keyboard-modal');
    modal.classList.remove('active');

})
document.querySelector(".custom-gaze-keyboard .cancel").addEventListener('click', () => {
    customInput.value = '';
    const modal = document.querySelector('.custom-gaze-control-keyboard-modal');
    modal.classList.remove('active');

})

document.querySelectorAll(".custom-gaze-keyboard .alphabetical,.custom-gaze-keyboard .spec-char").forEach((elem) => {
    elem.addEventListener('click', () => {
        const currentText = elem.querySelector('p').textContent; // Get the text inside the <p> tag
        customInput.value += currentText; // Append it to the input field's value
    });
});