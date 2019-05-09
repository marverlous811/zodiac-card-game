export function shuffleArray(arr : Array<any>){
    let counter = arr.length;
    
    while(counter > 0){
        //pick a random index
        let index = Math.floor(Math.random() * counter);

        counter--;

        let temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }

    return arr;
}

export function randomNumber (min: number, max: number){
    return Math.floor(Math.random() * (+max - +min)) + +min;
}