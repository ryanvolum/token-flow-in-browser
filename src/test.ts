import { Pipeline, printTokens } from './pipeline';

function pipelineDemo(query: string, debugMode = false) {
    const pipeline = new Pipeline(
        './data/menu.json',
        './data/intents.json',
        './data/attributes.json',
        './data/quantifiers.json',
        undefined,
        debugMode);

    const tokens = pipeline.processOneQuery(query);

    console.log(`"${query}"`);
    console.log();
    printTokens(tokens);
}

pipelineDemo('I want a hamburger', true);