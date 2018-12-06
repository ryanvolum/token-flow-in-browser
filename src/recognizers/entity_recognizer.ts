import { CompositeToken, Item, PatternRecognizer, PID, StemmerFunction, Token, Tokenizer } from 'token-flow';
import { itemMapFromJSON } from './utilities';

export const ENTITY: unique symbol = Symbol('ENTITY');
export type ENTITY = typeof ENTITY;

export interface EntityToken extends CompositeToken {
    type: ENTITY;
    children: Token[];
    pid: PID;
    name: string;
}

export type EntityRecognizer = PatternRecognizer<Item>;

export function CreateEntityRecognizer(
    entityJSON: string,
    downstreamWords: Set<string>,
    stemmer: StemmerFunction = Tokenizer.defaultStemTerm,
    debugMode = false) {
    const items = itemMapFromJSON(entityJSON);

    const tokenFactory = (id: PID, children: Token[]): EntityToken => {
        const item = items.get(id);

        let name = "UNKNOWN";
        if (item) {
            name = item.name;
        }
        return { type: ENTITY, pid: id, name, children };
    };

    return new PatternRecognizer(items, tokenFactory, downstreamWords, stemmer, false, true, debugMode);
}
