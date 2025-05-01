function moveSlider(radio, slider) {
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

    if (!radioChecked) return;

    moveSlider(radioChecked, slider);
}

function toggleContactMethod() {
    const radios = document.querySelectorAll('input[name="contact"]');
    const slider = document.querySelector('.slider');

    initContactMethod(radios, slider)

    radios.forEach((radio, index) => {
        radio.addEventListener('change', () => {
            moveSlider(radio, slider)
        });
    });
};

function toggleBudgetInput() {
    const budget = document.getElementById('budget-container');
    const budgetLabel = document.querySelector('#budget-container > input');
    const select = document.getElementById('subject');

    if (!select) return;

    console.log(budget)
    formatCurrency(budgetLabel);

    select.addEventListener('change', () => {
        const value = select.value;
        if (value === 'orcamento') {
            budget.classList.remove('hidden');
        } else {
            budget.classList.add('hidden');
        }
    });
}

function initiContactInfoLabel(radios, contactInfoLabel) {
    const radioChecked = Array.from(radios).find(x => x.checked);

    if (!radioChecked) return;

    if (radioChecked.value === 'email') {
        contactInfoLabel.innerText = 'Email';
    } else if (radioChecked.value === 'whatsapp') {
        contactInfoLabel.innerText = 'WhatsApp';
    }
}

function toggleContactInfoLabel() {
    const radios = document.querySelectorAll('input[name="contact"]');
    const contactInfoLabel = document.querySelector('#contact-info-container > label');
    const contactInfoInput = document.querySelector('#contact-info-container > input');

    initiContactInfoLabel(radios, contactInfoLabel);
    validateContactInfo(contactInfoInput);

    radios.forEach((radio, index) => {
        radio.addEventListener('change', () => {
            contactInfoInput.value = '';
            if (radio.value === 'email') {
                contactInfoLabel.innerText = 'Email';
                contactInfoInput.dataset.type = 'email';
                contactInfoInput.setAttribute('maxlength', '254');
            } else if (radio.value === 'whatsapp') {
                contactInfoLabel.innerText = 'WhatsApp';
                contactInfoInput.dataset.type = 'whatsapp';
                contactInfoInput.removeAttribute('maxlength');
            }
        })
    });
}

function toggleContactForm() {
    const dialog = document.querySelector('.contact-container');
    const body = document.querySelector('body');
    const form = document.getElementById('contact-form');
    const h1 = document.querySelector('.titulo-principal');

    h1.addEventListener('click', (event) => {
        event.stopPropagation();

        if (dialog.hasAttribute('open')) {
            dialog.removeAttribute('open');
            body.classList.remove('modal-open');
        } else {
            dialog.setAttribute('open', '');
            body.classList.add('modal-open');
            form.reset();
        }
    });

    document.addEventListener('click', (event) => {
        if (dialog.hasAttribute('open') && !dialog.contains(event.target)) {
            dialog.removeAttribute('open');
            body.classList.remove('modal-open');
        }
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

            if (value.length > 11) {
                value = value.slice(0, 11);
            }

            input.value = value;
        }
    });
}

function formatCurrency(input) {
    input.addEventListener('input', () => {
        let value = input.value.replace(/\D/g, '');
        value = (parseInt(value, 10) / 100).toFixed(2);
        value = value
            .replace('.', ',')
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        input.value = `R$ ${value}`;
    });
}

function validateName(input) {
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]*$/;

    input.addEventListener('input', () => {
        let value = input.value;

        value = value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s'-]/g, '');

        input.value = value;
    });
}

export function initContactForm() {
    const form = document.getElementById('contact-form');
    validateName(form.elements['nome']);
    toggleContactForm()
    toggleContactMethod();
    toggleBudgetInput();
    toggleContactInfoLabel();
}