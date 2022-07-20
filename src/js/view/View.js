import icons from 'url:../../img/icons.svg';

export default class view {
    data;

    /**
     * Render the recived object ro the DOM
     * @param {Object | Object[]} data the data to be rendered
     * @param {boolean} {render=true} if false , create markup string instead if rendering to the DOM
     * @returns  {undefined| string} A markup string is retured if render = false
     * @this {Object} View object
     * @author Aliza ZARE
     */
    render(data, render = true) {
        if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
        this.data = data;
        const markup = this.generateMarkup();

        if (!render) return markup;
        this.clear();
        this.parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    clear() {
        this.parentElement.innerHTML = '';
    }

    update(data) {
        this.data = data;
        const newMarkup = this.generateMarkup();

        const newDOM = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const curElement = Array.from(this.parentElement.querySelectorAll('*'));
        newElements.forEach((newEl, i) => {
            const curEl = curElement[i];

            if (!newEl.isEqualNode(curEl) && newEl.firstChild.nodeValue.trim() != '') {
                curEl.textContent = newEl.textContent;
            }
            if (!newEl.isEqualNode(curEl))
                Array.from(newEl.attributes).forEach(attr => {
                    curEl.setAttribute(attr.name, attr.value);
                })

        })


    }

    renderSpinner = function() {
        const markup = `
        <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div>
        `;
        this.parentElement.innerHTML = '';
        this.parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderError(message = this.errorMessage) {
        const markup = `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
          `
        this.clear();
        this.parentElement.insertAdjacentHTML('afterbegin', markup);

    }
    renderMessage(message = this.message) {
        const markup = `
        <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
          `
        this.clear();
        this.parentElement.insertAdjacentHTML('afterbegin', markup);

    }
}