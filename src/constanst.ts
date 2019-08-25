 const letters = "aeiouaeioabcdefghijklmnopqrstuvwxyz";


 export const getLetter = () => {
     return letters[Math.floor(Math.random() * letters.length)]
 }

 export const BOARDSIZE = 12

 export const URL = "https://bzh0wuu92a.execute-api.eu-west-1.amazonaws.com/prod"

 export const points = {
     a: 1,
     b: 3,
     c: 3,
     d: 1,
     e: 1,
     f: 5,
     g: 2,
     h: 2,
     i: 1,
     j: 4,
     k: 4,
     l: 2,
     m: 3,
     n: 1,
     o: 1,
     p: 3,
     q: 10,
     r: 1,
     s: 1,
     t: 1,
     u: 4,
     v: 4,
     w: 4,
     x: 8,
     y: 8,
     z: 6,
 }