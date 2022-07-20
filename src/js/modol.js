import { async } from "regenerator-runtime";
import { API_URl, RES_PER_PAGE, KEY } from "./config.js";
// import { getJSON, sendJSON } from './helpers.js'
import { AJAX } from './helpers'
export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
};
const createRecipeObhect = function(data) {
    let { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key }),

    };
}
export const loadRecipe = async function(id) {
    try {
        const data = await AJAX(`${API_URl}${id}?key=${KEY}`);
        state.recipe = createRecipeObhect(data);

        if (state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;

    } catch (err) {
        console.error(`${err} 💣💣💣`);
        throw err;
    }
}

export const loadSearchResult = async function(query) {
    try {
        state.search.query = query;
        console.log(query);
        const data = await AJAX(`${API_URl}?search=${query}&key=${KEY}`);
        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && { key: rec.key })
            };
        });
        state.search.page = 1;
    } catch (err) {
        console.error(`${err} 💣💣💣`);
        throw err;
    }
}
export const getSearchResultPage = function(page = state.search.page) {
    state.search.page = page;
    const start = (page - 1) * state.search.resultPerPage; // 0;
    const end = page * state.search.resultPerPage; // 9;
    return state.search.results.slice(start, end);
}

export const updateServing = function(newServing) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServing / state.recipe.serving;
    });

    state.recipe.serving = newServing;
}



const persistBookmarks = function() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}
export const addBookmark = function(recipe) {
    // Add bookmark
    state.bookmarks.push(recipe);

    // Mark current recipe as bookmark
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks();
}
export const deleteBookmark = function(id) {
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    // Mark current recipe as  NOT bookmark
    if (id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks();

};

const init = function() {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
};

init();

const clearBookmarks = function() {
        localStorage.clear('bookmarks');
    }
    // clearBookmarks();


export const uploadRecipe = async function(newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe).filter(
            entry => entry[0].startsWith('ingredient') && entry[1] !== '').map(
            ing => {
                const ingArr = ing[1].replaceAll(' ', '').split(',');
                if (ingArr.length !== 3) throw Error('Wrong ingredient format , please use the correct format');
                const [quantity, unit, description] = ingArr;
                return { quantity: quantity ? +quantity : null, unit, description }
            }
        )
        const recipe = {
            title: newRecipe.title,
            image_url: newRecipe.image,
            source_url: newRecipe.sourceUrl,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        }
        const data = await AJAX(`${API_URl}?key=${KEY} `, recipe)
        state.recipe = createRecipeObhect(data);
        addBookmark(state.recipe)
    } catch (err) {
        throw err;
    }

}