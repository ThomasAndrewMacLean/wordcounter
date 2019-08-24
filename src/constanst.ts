 const letters = "abcdefghijklmnopqrstuvwxyz";


 export const getLetter = () => {
     return letters[Math.floor(Math.random() * letters.length)]
 }

 export const BOARDSIZE = 16

 export const URL = "https://bzh0wuu92a.execute-api.eu-west-1.amazonaws.com/prod?word="