import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit, 
            ingredient
        }
        this.items.push(item);
        return(item);
    }

    deleteItem (id) {
        /// find postion based on id passed
        const index = this.items.findIndex(el => el.id === id);
        /// [2,4,8]  --- splice(1, 2) -> returns [4, 8], org array [2,8]
        /// [2,4,8]  --- splice(1, 2) -> returns 4, org array [2,8]
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
    }
}