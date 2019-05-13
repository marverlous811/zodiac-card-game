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

export function makeid(length: number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }