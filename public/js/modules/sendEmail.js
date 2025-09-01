export default class SendEmail {
  constructor(formSelector, endpoint = "http://localhost:3000/send") {
    this.form = document.querySelector(formSelector);
    this.endpoint = endpoint;
    if (this.form) {
      this.init();
    }
  }

  init() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  async handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      alert(result.message);
      this.form.reset();
    } catch (error) {
      alert("Erro ao enviar. Tente novamente.");
    }
  }
}
