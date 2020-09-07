const helpers = {};

helpers.randomNumber = () => {
    let randomNumber = 0;
    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for(let i = 0; i < 6; i++){
    randomNumber +=  possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return randomNumber;
}

module.exports = helpers;