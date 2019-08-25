// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const el = (id: string): HTMLElement => document.getElementById(id)!;
export const grid = el('grid');
export const wordElement = el('word');
export const deleteButton = el('delete');
export const submitButton = el('submit');
export const scoreElement = el('score');
export const wordsModal = el('wordsModal');
export const saveButton = el('save');
export const newGameButton = el("newGame")