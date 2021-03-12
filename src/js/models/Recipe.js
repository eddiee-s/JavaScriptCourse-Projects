import axios from 'axios';
import {} from '../config';
import { key } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios (`https://api.spoonacular.com/recipes/${this.id}/information?apiKey=${key}&includeNutrition=false`);
            const ingr = await axios (`https://api.spoonacular.com/recipes/${this.id}/ingredientWidget.json?apiKey=${key}`);
            const photo = `https://spoonacular.com/recipeImages/${this.id}-556x370.jpg`;
            const ingredients = ingr.data.ingredients;
            this.title = res.data.title;
            this.author = res.data.sourceName;
            this.img = photo;
            this.url = res.data.sourceUrl;
            this.ingredients = ingredients;
            this.serv = res.data.servings;

        } catch (error) {
            console.log(error);
            alert(`Something is wrong :( \n${error}`);
        }
    }
    

    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        const serving = this.serv;
        this.servings = serving;
    }

    /* ----- no need for spoonacular API

        parseIngredients() {
        
        const newIngredients = this.ingredients.map(el => {
            // 1) Uniform units 

            // 2) Remove parentheses
            
            
            // 3) Parse ingredients into count, unit and ingredient 
        });
        this.ingredients = newIngredients;
    } */

updateServings (type) {
    // Servings
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

    // Ingridients 
    this.ingredients.forEach(ing => {
        ing.amount.metric.value*= (newServings / this.servings);
    })
    this.servings = newServings;
}

}