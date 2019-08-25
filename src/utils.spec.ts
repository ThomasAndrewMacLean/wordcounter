import {
    getWordValue
} from "./utils";
import {
    exportAllDeclaration
} from "@babel/types";

describe("utils", () => {

    it("gives zero for empty string", () => {
        expect(getWordValue("")).toBe(0)
    })

    it("calculates the word value", () => {
        expect(getWordValue("wowzys")).toBe(24)
    })


})