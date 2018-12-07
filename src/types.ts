import { Token } from 'token-flow';

export interface IncomingToken extends Token {
    children?: IncomingToken[];
    text: string;
    pid?: number;
    name?: string;
    value?: string | number;
}

export interface FlatToken {
    text: string;
    type: string;
    name?: string;
    pid?: number;
    value?: string | number;
}
