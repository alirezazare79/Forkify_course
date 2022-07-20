import view from "./View"
import previewView from "./previewView";
import icons from 'url:../../img/icons.svg';


class BookmarkView extends view {
    errorMessage = "No bookmarks yet. Find a bood recipe and bookmark is";
    message = '';
    parentElement = document.querySelector('.bookmarks__list');

    addHandlerRender(handler) {
        window.addEventListener('load', handler)
    }

    generateMarkup() {
        console.log(this.data);
        return this.data.map(bookmark => previewView.render(bookmark, false)).join('');

    }


}

export default new BookmarkView();