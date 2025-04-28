import { initContactForm } from "./modules/contactForm.js";

const h1 = document.querySelector('.titulo-principal');
h1.addEventListener('click', (event) => {
    initContactForm();
});