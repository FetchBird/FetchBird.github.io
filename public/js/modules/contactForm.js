function moveSlider(radio, slider) {
    console.log('moveSlider', slider);
    const whatsappIcon = document.querySelector('.whatsapp-icon-container');
    const emailIcon = document.querySelector('.email-icon-container');

    if (radio.value == 'email') {
        slider.classList.remove('right');
        whatsappIcon.querySelector('.whatsapp-icon-black').classList.add('active');
        whatsappIcon.querySelector('.whatsapp-icon-orange').classList.remove('active');
        emailIcon.querySelector('.email-icon-black').classList.remove('active');
        emailIcon.querySelector('.email-icon-orange').classList.add('active');
    } else {
        slider.classList.add('right');
        whatsappIcon.querySelector('.whatsapp-icon-black').classList.remove('active');
        whatsappIcon.querySelector('.whatsapp-icon-orange').classList.add('active');
        emailIcon.querySelector('.email-icon-black').classList.add('active');
        emailIcon.querySelector('.email-icon-orange').classList.remove('active');
    }
}

function initContactMethod(radios = [], slider) {
    const radioChecked = Array.from(radios).find(x => x.checked);
    if (radioChecked) moveSlider(radioChecked, slider);
}

function toggleContactMethod() {
    const radios = document.querySelectorAll('input[name="contact"]');
    const slider = document.querySelector('#radio-container .slider');
    initContactMethod(radios, slider);
    radios.forEach(radio => {
        radio.addEventListener('change', () => moveSlider(radio, slider));
    });
}

function toggleBudgetInput() {
    const budget = document.getElementById('budget-container');
    const budgetLabel = budget.querySelector('input');
    const select = document.getElementById('subject');
    if (!select) return;

    formatCurrency(budgetLabel);

    select.addEventListener('change', () => {
        budget.classList.toggle('hidden', select.value !== 'orcamento');
    });
}

function initContactInfoLabel(radios, contactInfoLabel) {
    const radioChecked = Array.from(radios).find(x => x.checked);
    if (!radioChecked) return;
    contactInfoLabel.innerText = radioChecked.value === 'email' ? 'Email' : 'WhatsApp';
}

function toggleContactInfoLabel() {
    const radios = document.querySelectorAll('input[name="contact"]');
    const label = document.querySelector('#contact-info-container > label');
    const input = document.querySelector('#contact-info-container > input');

    initContactInfoLabel(radios, label);
    validateContactInfo(input);

    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            input.value = '';
            if (radio.value === 'email') {
                label.innerText = 'Email';
                input.dataset.type = 'email';
                input.setAttribute('maxlength', '254');
            } else {
                label.innerText = 'WhatsApp';
                input.dataset.type = 'whatsapp';
                input.removeAttribute('maxlength');
            }
        });
    });
}

function validateContactInfo(input) {
    input.addEventListener('input', () => {
        const type = input.dataset.type;
        if (type === 'email') {
            const value = input.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            input.setCustomValidity(value && !emailRegex.test(value) ? "E-mail inválido." : "");
        } else if (type === 'whatsapp') {
            let value = input.value.replace(/\D/g, '');
            input.value = value.slice(0, 11);
        }
    });
}

function formatCurrency(input) {
    input.addEventListener('input', () => {
        let value = input.value.replace(/\D/g, '');

        if (!value) {
            input.value = '';
            return;
        }

        value = (parseInt(value, 10) / 100).toFixed(2);
        value = value.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        input.value = `R$ ${value}`;
    });
}


function validateName(input) {
    input.addEventListener('input', () => {
        input.value = input.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s'-]/g, '');
    });
}

function closeContactForm() {
    const dialog = document.querySelector('.contact-container');
    const body = document.querySelector('body');
    const budget = document.getElementById('budget-container');

    budget.classList.add('hidden');

    dialog.removeAttribute('open');
    body.classList.remove('modal-open');
}

function handleOutsideClickToClose() {
    document.addEventListener('click', (event) => {
        const dialog = document.querySelector('.contact-container');
        if (
            dialog?.hasAttribute('open') &&
            !dialog.contains(event.target) &&
            !event.target.closest('.btn_contato')
        ) {
            closeContactForm();
        }
    });
}

export function openContactForm(button) {
    const dialog = document.querySelector('.contact-container');
    const body = document.querySelector('body');
    const form = document.getElementById('contact-form');

    if (!dialog.hasAttribute('open')) {
        dialog.setAttribute('open', '');
        body.classList.add('modal-open');
        form.reset();
        initContactForm(); // separada para agrupar os toggles
        validateName(form.elements['nome']);
    }
}

function initContactForm() {
    toggleContactMethod();
    toggleBudgetInput();
    toggleContactInfoLabel();
}

export function setupContactForm(button) {
    handleOutsideClickToClose();
    button.addEventListener('click', () => openContactForm(button));
}
