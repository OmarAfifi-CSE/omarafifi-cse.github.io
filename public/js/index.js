
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


//See more (My Work)
document.getElementById('see-more-btn').addEventListener('click', function(event) {
    event.preventDefault();
    const hiddenContent = document.querySelector('.hidden-content');
    hiddenContent.classList.add('show'); // Add the class to trigger the transition
    this.style.display = 'none'; // Hide the "See More" button after clicking
});

