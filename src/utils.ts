import { points, letters } from './constanst';

export const getPoint = (letter: string): number => {
    return points[letter];
};

export const getWordValue = (word: string): number => {
    return word.split('').reduce((total, letter) => {
        return (total += getPoint(letter));
    }, 0);
};

export const getLetter = (): string => {
    return letters[Math.floor(Math.random() * letters.length)];
};

export const getUserName = (): string => {
    let name = window.localStorage.getItem('userName');
    while (!name) {
        name = prompt('Vul u naam in aub');
    }
    window.localStorage.setItem('userName', name);
    return name;
};
