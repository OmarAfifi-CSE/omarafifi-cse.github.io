//Color Picker
document.getElementById('colorPicker').addEventListener('input', function () {
    const color = this.value;
    document.documentElement.style.setProperty('--my-color', color);
});

//Side Menu
var sidemenu = document.getElementById("sidemenu");
function openmenu() {
    sidemenu.style.right = "0";
}
function closemenu() {
    sidemenu.style.right = "-200px";
}

//Google Sheet (Contact Me)
const scriptURL = 'https://script.google.com/macros/s/AKfycbx6Iy37SouYu_YjHu0gdn-CnQ7thOhj3rnX8KFspXF2e2PWXEY9rsINdN90A7fdoztDHA/exec'
const form = document.forms['submit-to-google-sheet']
const msg = document.getElementById("msg")
if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', e => {
        e.preventDefault()
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
            .then(response => {
                msg.innerHTML = "Your message has been sent successfully";
                msg.classList.add("show");
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                form.reset();
                setTimeout(function () {
                    msg.classList.remove("show");
                }, 4000)
            })
            .catch(error => {
                console.error('Error!', error.message);
                msg.innerHTML = "Error sending message";
                msg.style.color = "red";
                msg.classList.add("show");
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            })
    })
}