import { CompositeRecognizer } from 'token-flow';
import { CompositeToken, Recognizer, StemmerFunction, Token, Tokenizer, WORD, WordToken } from 'token-flow';

import { ATTRIBUTE, AttributeToken, CreateAttributeRecognizer } from '../recognizers';
import { MULTIPLE_ATTRIBUTE, MultipleAttributeToken } from '../recognizers';
import { CreateEntityRecognizer, ENTITY, EntityToken } from '../recognizers';
import { CreateIntentRecognizer, INTENT, IntentToken } from '../recognizers';
import { CreateQuantityRecognizer, QUANTITY, QuantityToken } from '../recognizers';
import { CreateNumberRecognizer } from '../recognizers';

type AnyToken =
    AttributeToken |
    EntityToken |
    IntentToken |
    MultipleAttributeToken |
    QuantityToken |
    WordToken;

export function tokenToString(t: Token) {
    const token = t as AnyToken;
    let name: string;
    switch (token.type) {
        case ATTRIBUTE:
            const attribute = token.name.replace(/\s/g, '_').toUpperCase();
            name = `[ATTRIBUTE:${attribute},${token.id}]`;
            break;
        case MULTIPLE_ATTRIBUTE:
            name = `[ATTRIBUTE:MULTIPLE,${token.pids.join(',')}]`;
            break;
        case ENTITY:
            const entity = token.name.replace(/\s/g, '_').toUpperCase();
            name = `[ENTITY:${entity},${token.pid}]`;
            break;
        case INTENT:
            name = `[INTENT:${token.name}]`;
            break;
        case QUANTITY:
            name = `[QUANTITY:${token.value}]`;
            break;
        case WORD:
            name = `[WORD:${token.text}]`;
            break;
        default:
            {
                const symbol = t.type.toString();
                name = `[${symbol.slice(7, symbol.length - 1)}]`;
            }
    }
    return name;
}

export function printToken(token: Token, indent = 0) {
    const spaces = new Array(2* indent + 1).join(' ');
    if (token.type === WORD) {
        console.log(`${spaces}WORD: "${(token as WordToken).text}"`);
    }
    else {
        console.log(`${spaces}${tokenToString(token)}`);
        for (const child of (token as CompositeToken).children) {
            printToken(child, indent + 1);
        }
    }
}

export function printTokens(tokens: Token[]) {
    for (const token of tokens) {
        printToken(token);
    }
    console.log();
}

export class Pipeline {
    public attributeRecognizer: Recognizer;
    public entityRecognizer: Recognizer;
    // fixupRecognizer: Recognizer2;
    public intentRecognizer: Recognizer;
    public numberRecognizer: Recognizer;
    public quantityRecognizer: Recognizer;

    public compositeRecognizer: CompositeRecognizer;

    constructor(
        entityFile: string,
        intentsFile: string,
        attributesFile: string,
        quantifierFile: string,
        stemmer: StemmerFunction = Tokenizer.defaultStemTerm,
        debugMode = false
    ) {
        // this.fixupRecognizer = new FixupRecognizer();

        this.intentRecognizer = CreateIntentRecognizer(
            intentsFile,
            new Set<string>(),
            stemmer,
            debugMode);

        this.quantityRecognizer = CreateQuantityRecognizer(
            quantifierFile,
            new Set(),
            stemmer,
            debugMode);

        this.numberRecognizer = CreateNumberRecognizer();

        const attributeDownstreamWords = new Set([
            ...this.quantityRecognizer.terms(),
            ...this.numberRecognizer.terms()
        ]);

        this.attributeRecognizer = CreateAttributeRecognizer(
            attributesFile,
            attributeDownstreamWords,
            stemmer,
            debugMode);

        const entityDownstreamWords = new Set([
            ...this.intentRecognizer.terms(),
            ...this.quantityRecognizer.terms(),
            ...this.numberRecognizer.terms(),
            ...this.attributeRecognizer.terms()
        ]);

        this.entityRecognizer = CreateEntityRecognizer(
            entityFile,
            entityDownstreamWords,
            stemmer,
            debugMode);

        this.compositeRecognizer = new CompositeRecognizer(
            [
                this.entityRecognizer,
                this.attributeRecognizer,
                this.numberRecognizer,
                this.quantityRecognizer,
                // this.fixupRecognizer,
                this.intentRecognizer
            ],
            debugMode
        );
    }

    public processOneQuery(query: string, debugMode = true) {
        const input = query.split(/\s+/).map( term => ({ type: WORD, text: term }));
        const tokens = this.compositeRecognizer.apply(input);
        return tokens;
    }
}
