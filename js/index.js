const homeButton = document.querySelector('#index');
const performanceClassButton = document.querySelector('#performanceClass');
const signupButton = document.querySelector('#signup');
const calendarButton = document.querySelector('#calendar');
const coachesButton = document.querySelector('#coaches');
const galleryButton = document.querySelector('#gallery');
const navButtons = [homeButton, performanceClassButton, signupButton, calendarButton, coachesButton, galleryButton];

navButtons.forEach(button => {
    button.addEventListener('click', e => {
        window.location.href = `${e.target.id}.html`;
    })
});