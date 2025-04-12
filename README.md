/FETCH-BIRD
│
├── public/                        # Tudo que será servido diretamente ao navegador
│   ├── assets/
│   │   ├── images/                # Imagens, logos, ícones
│   │   └── fonts/                 # Fontes personalizadas (se houver)
│   │
│   ├── css/
│   │   ├── style.css              # Estilo principal
│   │   └── components/            # Seções ou partes específicas (ex: header.css)
│   │
│   ├── js/
│   │   ├── main.js                # Script principal (inicialização)
|   |   |── modules/
│   │   │   ├── header.js
│   │   │   ├── about.js
│   │   │   ├── services.js
│   │   │   └── footer.js
│   │   │── libs/
│   │   |   |── animation.js       # Tudo relacionado ao GSAP
|   |   |   └── slider.js          # Swiper.js configuração
│   │   └── utils/                 # Funções utilitárias (ex: debounce.js, helpers.js)
│   │
│   ├── index.html                 # Sua única página
│   └── favicon.ico
│
├── backend/                       # Código Node.js para envio de e-mail
│   ├── mailer.js                  # Configuração do Nodemailer
│   ├── server.js                  # Express ou http server
│   └── .env                       # Senhas, chaves (SMTP, Gmail, etc.)
│
└── README.md