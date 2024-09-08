
//typewriter effect
const texts = [
    "Software Engineer",
    "Developer",
    "Designer"
]

let speed = 100;
const textElements = document.querySelector(".typewriter-text");
let textIndex = 0;
let characterIndex = 0;

function typeWriter() {
    if (characterIndex < texts[textIndex].length) {
        textElements.innerHTML += texts[textIndex].charAt(characterIndex);
        characterIndex++;
        setTimeout(typeWriter, speed);
    }
    else {
        setTimeout(eraseText, 1000);
    }
}
function eraseText() {
    if (textElements.innerHTML.length > 0) {
        textElements.innerHTML = textElements.innerHTML.slice(0, -1);
        setTimeout(eraseText, 50);
    } else {
        textIndex = (textIndex + 1) % texts.length;
        characterIndex = 0;
        setTimeout(typeWriter, 500);
    }
}
window.onload = typeWriter

//Color Picker
document.getElementById('colorPicker').addEventListener('input', function () {
    const color = this.value;
    document.documentElement.style.setProperty('--my-color', color);
});

//tablinks (About Me)
var tablinks = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");

function opentab(tabname) {
    for (tablink of tablinks)
        tablink.classList.remove("active-link");

    for (tabcontent of tabcontents)
        tabcontent.classList.remove("active-tab");

    event.currentTarget.classList.add("active-link");
    document.getElementById(tabname).classList.add("active-tab");
}

//Script to handle collapsible sections with arrows (Skills)
document.querySelectorAll('.collapsible-header').forEach(header => {
    header.addEventListener('click', function() {
        const content = this.nextElementSibling;
        const isActive = this.classList.toggle('active');
        
        if (isActive) {
            // Set max-height to the scrollHeight of the content
            content.style.maxHeight = content.scrollHeight + 'px';
        } else {
            // Collapse the content
            content.style.maxHeight = '0';
        }
    });
});


//Side Menu
var sidemenu = document.getElementById("sidemenu");
function openmenu() {
    sidemenu.style.right = "0";
}
function closemenu() {
    sidemenu.style.right = "-200px";
}

//See more (My Work)
document.getElementById('see-more-btn').addEventListener('click', function(event) {
    event.preventDefault();
    const hiddenContent = document.querySelector('.hidden-content');
    hiddenContent.classList.add('show'); // Add the class to trigger the transition
    this.style.display = 'none'; // Hide the "See More" button after clicking
});

//Google Sheet (Contact Me)
const scriptURL = 'https://script.google.com/macros/s/AKfycbweMWCMh9HJl5Py1Q2pO1vTBvI6iNeLSSEmCdHJpWE6_xGpRIq4l-Iq1971SHAkb9aBog/exec'
const form = document.forms['submit-to-google-sheet']
const msg = document.getElementById("msg")
form.addEventListener('submit', e => {
    e.preventDefault()
    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(response => {
            msg.innerHTML = "Your massege has been sent successfuly"
            setTimeout(function () {
                msg.innerHTML = ""
            }, 4000)
            form.reset();
        })
        .catch(error => console.error('Error!', error.message))
})
