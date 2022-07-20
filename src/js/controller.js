import * as modal from './modol'
import { MODAL_CLOSE_SEC } from './config';
import recipeView from './view/recipeView';
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import recipeView from './view/recipeView';
import searchView from './view/searchView';
import bookmarkView from './view/bookmarkView';
import resultView from './view/resultView';
import paginationView from './view/paginationView';
import { async } from 'regenerator-runtime';
import addReciepView from './view/addReciepView';



// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// if (module.hot) {
//     module.hot.accept();
// }


const controlRecipe = async function() {
    try {
        const id = window.location.hash.slice(1);
        if (!id) return;
        recipeView.renderSpinner();


        // 0) Update result view to mark selected search result
        // resultView.update(modal.getSearchResultPage());
        bookmarkView.update(modal.state.bookmarks);


        // 1) Loading recipe
        await modal.loadRecipe(id);

        // 2 Rendering the recipe
        recipeView.render(modal.state.recipe);


    } catch (err) {
        console.log(err);
        recipeView.renderError();
    }
}

const controlSearchResult = async function() {
    try {
        resultView.renderSpinner();
        // 1) Get search query
        const query = searchView.getQuery();
        if (!query) return;

        // 2) Load search result

        await modal.loadSearchResult(query);

        // 3) Render result
        resultView.render(modal.getSearchResultPage());


        // 4) Render initial pagination buttons
        paginationView.render(modal.state.search);
    } catch (err) {
        console.log(err);
    }
}
controlSearchResult();


const newFunc = function() {
    console.log("Welcome to application");
}
const init = function() {
    bookmarkView.addHandlerRender(controllBookmarks);
    recipeView.addHandlerRender(controlRecipe);
    recipeView.addHandlerUpdateServing(controlServing);
    recipeView.addhandlerAddBookmark(controlAddNewBookmark);
    searchView.addHandlerSearch(controlSearchResult);
    paginationView.addHandlerClick(controlPagination);
    addReciepView.addHandlerUpload(controllAddRecipe);
    newFunc();

}

const controlPagination = function(goToPage) {
    resultView.render(modal.getSearchResultPage(goToPage));


    paginationView.render(modal.state.search);
}

const controlServing = function(newServing) {
    // Update the recipe serving (in state)
    modal.updateServing(newServing);

    // Update the recipe view
    // recipeView.render(modal.state.recipe);
    recipeView.update(modal.state.recipe);
}

const controlAddNewBookmark = function() {
    // Add or remove bookmark
    if (!modal.state.recipe.bookmarked) modal.addBookmark(modal.state.recipe);
    else modal.deleteBookmark(modal.state.recipe.id);

    // Update recipe view
    recipeView.update(modal.state.recipe);

    // Render bookmark
    bookmarkView.render(modal.state.bookmarks);
}


const controllBookmarks = function() {
    bookmarkView.render(modal.state.bookmarks)
}

const controllAddRecipe = async function(newRecipe) {
    try {
        // Show laoding spinner
        addReciepView.renderSpinner();

        // Uplaod the new data
        await modal.uploadRecipe(newRecipe);
        console.log(modal.state.recipe);

        // Render recipe
        recipeView.render(modal.state.recipe);

        // Success message
        addReciepView.renderMessage();

        // Render bookmark view
        bookmarkView.render(modal.state.bookmarks);

        // Change id in URL
        window.history.pushState(null, '', `#${modal.state.recipe.id}`)


        // Close form window
        setTimeout(function() {
            addReciepView.toggleWindow()
        }, MODAL_CLOSE_SEC)
    } catch (error) {
        console.log('💣💣💣', error);
        addReciepView.renderError(error.message);
    }

}

init();