# React Speech Client Sample for token-flow

This project demonstrates how we can do real-time in-browser entity extraction from speech. 

## Running this Sample
1. Clone sample and navigate to project directory
2. Run ```npm install```
3. Run ```npm run start```
4. Start ordering items from the catalog found in `src/data/menu.json`

## What this Sample Uses

- [React](https://reactjs.org/) - To minimize the latency/complexity of re-rendering/painting of the DOM 
- [create-react-app-typescript](https://github.com/wmonk/create-react-app-typescript) - To minimize the configuration complexity of an in-browser TypeScript React app
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API) - For in-browser speech recognition
- [token-flow](https://www.npmjs.com/package/token-flow) - To run transcribed speech through a pipeline that recognizes where entities exist

## What this Sample Does

This sample takes inputted speech audio, transcribes it, and runs it through a pipeline of tokenizers which identify and tokenize items that exist in a catalog. This sample includes a catalog (`menu.json`) of items from a faux restaurant. Run the sample and place orders (e.g. "I would like a dakota burger and fries") to observe the real-time recognition and lexing capabilities afforded from this approach:



## Data-driven

At its core, this sample demonstrates how we can extract entities based on some underlying data-store. If we changed our catalog of items, our tokenizer will now recognize different items. This is expressly _not_ using machine learning, so there is no training step. It relies on token-flow, which uses a varitety of search techniques to determine where in an utterance a token exists. In compiler terms, this can be compared to a lexer, which extracts relevant information that can then be reasoned over by a parser. 

## Low Latency

This sample browserifies all tokenization, so everything is running on the client. Further, it uses the Web Speech API to stream recognition. Finally, the rendered results use React and are fully state-driven, so the token table updates as the user is speaking. 

## Entity Extraction 
What makes this approach fundamentally unique is that we aren't using patterns or machine learning to determine where in an utterance some entity lies. Let's take a look at traditional entity extraction approaches, their limitations, and how this approach resolves these issues. 

### Traditional Approach

Traditional NLP takes example utterances with highlighted entities to guess where an entity might lie: 

I want to book a flight from ```Seattle``` to ```Tokyo```.

We might train our NLP model to recognize that ```Seattle``` is an entity of type ```fromLocation``` and ```Tokyo``` is an entity of type ```toLocation```. With enough examples, our model would then be able to successfully "guess" where entities lie in future utterances: 

Let me get a flight from ```Miami``` to ```Lima```. 

Once we have the necessary entities, we would then pass them to some kind of "recognizer" to validate that "Miami" and "Lima" are in fact valid flight locations. This recognizer could be as simple as a regular expression, or as complex as a fuzzy search. 

### Limitations

The above approach does have limitations. In the above example, different location names might have dramatically varying lengths, and an NLP model might not pick up outliers like:

I want to fly to ```Little Cottonwood Creek Valley Utah``` and I'm coming from ``` Washington-on-the-Brazos, Texas ```.

A model is only as good as its examples, and when training data has significant outliers, they often fail to get picked up. Alternatively, envision a bot which asks a user for an order ("What would you like to order"). The user might respond, "A burger", or "A burger please" or "a burger deluxe". Unless explicitly trained for this scenario, this model will either mistakenly pick up ```burger please``` as an ```item``` entity or miss the "deluxe" in ```burger deluxe```. Attempting to train a model on every possible example often leads to overfitting. 

Without any understanding the underlying entities, an NLP engine can only make guesses based on a subset of examples. But if we have a constrained number of entities in a dataset, we should be able to use that knowledge to inform our entity recognition. 

### This Approach

If we have a constrained number of entities in a dataset, then we should be able to identify where entities lie without (or before) passing an utterance into an NLP model. 

Token-flow provides utilities to identify where entities exist in an utterance. It takes a dataset (a catalog of entities) and creates a tokenizer. The tokenizer takes an utterance and tokenizes all of the known entities in that utterance. In compiler terms, token-flow can be thought of as a lexer - the output is a series of tokens that a parser can then reason over.

### Speech as an Input Modality 
As an input modality, speech is useful in:

1. Hands-off scenarios 
    - Speaking to a conversational agent in a car
    - Asking questions of a conversational agent while cooking

2. Scenarios where speech is already the primary mode of communication
    - Help desk phone calls
    - Food ordering

Speech enabled user interfaces have the interesting side-effect of text normalization. Speech recognition services will never misspell words. Further, most SR services allow the developer to define what format of response they want. With regard to numbers, for example, SR services generally allow developers to define whether they want numeric or lexical representation (12 vs 'twelve'). When building speech enabled assistants we then need to ensure that components downstream of speech expect the normalized speech recognition output. 

