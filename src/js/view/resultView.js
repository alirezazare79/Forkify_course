import view from "./View"
import icons from 'url:../../img/icons.svg';
import previewView from "./previewView.js";


class ResultView extends view {
    errorMessage = "No recipes found for your query! Please try again;";
    message = '';
    parentElement = document.querySelector('.results');

    generateMarkup() {
        console.log(this.data);
        return this.data.map(result => previewView.render(result, false)).join('');

    }

}

export default new ResultView();