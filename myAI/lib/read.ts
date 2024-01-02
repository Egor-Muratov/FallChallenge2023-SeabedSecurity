import { readline } from "./readline/readline";

export const readNumber = () => parseInt(readline());
export const readNumbers = () => readline().split(' ').map(Number);
