import {
    points
} from "./constanst";
export const getWordValue = (word: string): number => {
    return word.split("").reduce((total, letter) => {
        return total += points[letter]
    }, 0)
}