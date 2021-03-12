/* 
exmp --
import str from './models/Search';
// import {add as a, multiply as m, ID} from './views/searchView';
import *  as searchView from './views/searchView';

console.log(`Using imported functions!! ${searchView.add(searchView.ID, 2)} and ${searchView.multiply(3, 5)}, ${str}`); */

// Global app controller
//1344696c68c445278de7d164e5dcc047
//https://api.spoonacular.com/recipes/complexSearch

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

import { elements, renderLoader, clearLoader} from './views/base';

/**  Global state of app
-- Search Object
-- Current recipe Object
-- Shopping list Object
-- Liked recipes 
*/

const state = {}; 

//TESTING PURPOSES
//window.state = state;

/* 
SEARCH CONTROLLER
*/
const controlSearch = async () =>{
    // 1) get query from view
     const query = searchView.getInput();  
    // TESTING    const query = 'pizza';  
    console.log(query);

    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);
        //console.log(state.search);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        
        try {
            // 4) Search for recipes
            await state.search.getResults();
    
            // 5) render results on UI
            //console.log(state.search.result);
            searchView.renderResults(state.search.result);
            clearLoader();
        } catch (error) {
            alert('Something wrong with the search...');
            clearLoader();
        }
    } /* else {
        searchView.clearResults();
        searchView.invalidSearch();
        }*/
}

elements.searchForm.addEventListener('submit', e =>{
    e.preventDefault();
    controlSearch();
});

/* // Testing purposes only
window.addEventListener('load', e =>{
    e.preventDefault();
    controlSearch();
}); */

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    //console.log(btn);
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        console.log(goToPage);
    }
});

/* RECIPE CONTROLLER */
/* const r = new Recipe(663136);
r.getRecipe();
console.log(r); */

const controlRecipe = async () => {
    // get ID from url
    const id = window.location.hash.replace('#', '');
    //console.log(id);

    if (id) {
        // prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // highlight selected search item
        if (state.search) searchView.highLightSelected(id);
        
        // create new recipe object
        state.recipe = new Recipe(id);

        // TESTING
        //window.r = state.recipe;
        
        try {
            // get recipe data
            await state.recipe.getRecipe();
            //console.log(state.recipe.ingredients);

            // calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            // render recipe
            // console.log(state.recipe);
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
        } catch (error) {
            console.log(error);
            alert('Error processing recipe!');
        }
    }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/*****
 *  LIST CONTROLLER 
 * */
 const controlList = () => {
    //Create a new list  IF there is non yet
    if(!state.list) state.list = new List();

    //Add each ingredients to list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.amount.metric.value, el.amount.metric.unit, el.name);
        listView.renderItem(item);
    });
 }

//Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        //Delete from UI
        listView.deleteItem(id);

        //Update the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value,10);
        state.list.updateCount(id, val);
    }
});

/*****
 *  LIKE CONTROLLER 
 * */
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    
    // User has NOT yet liked current recipe
    if(!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button
        likesView.toggleLikeButton(true);
        // Add like to UI list
        likesView.renderLike(newLike);
                    //console.log(state.likes);

        // User has NOT yet liked current recipe
    }else {
        // Remove like to the state
        state.likes.deleteLike(currentID);
        // Toggle the like button
        likesView.toggleLikeButton(false);
        // Remove like to UI list
                    // console.log(state.likes);
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore likes
    state.likes.readStorage();

    //toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button clicked
        if (state.recipe.servings > 1) {
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);
        };
    } else if (e.target.matches('.btn-increase, .btn-increase *')){
        // increase button clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        //Add ingredients to shopping list 
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        //Like controller
        controlLike();
    }

    //console.log(state.recipe);
});

//window.l = new List();
