import { CompositeToken, Item, PatternRecognizer, PID, StemmerFunction, Token, Tokenizer } from 'token-flow';
import { itemMapFromJSON } from './utilities';

export const QUANTITY: unique symbol = Symbol('QUANTITY');
export type QUANTITY = typeof QUANTITY;

export interface QuantityToken extends CompositeToken {
    type: QUANTITY;
    children: Token[];
    value: number;
}

export type QuantityRecognizer = PatternRecognizer<Item>;

export function CreateQuantityRecognizer(
    quantityJSON: string,
    downstreamWords: Set<string>,
    stemmer: StemmerFunction = Tokenizer.defaultStemTerm,
    debugMode = false
): QuantityRecognizer {
    const items = itemMapFromJSON(quantityJSON);

    const tokenFactory = (id: PID, children: Token[]): QuantityToken => {
        return { type: QUANTITY, children, value: id };
    };

    return new PatternRecognizer(items, tokenFactory, downstreamWords, stemmer, false, true, debugMode);
}
