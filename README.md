# React Speech Client Sample for short-order

This sample demonstrates how we can extract catalog entities from recognized speech. 

## What this Sample Uses

This sample uses:

- [React](https://reactjs.org/) - To minimize the latency/complexity of re-rendering/painting of the DOM 
- [create-react-app-typescript](https://github.com/wmonk/create-react-app-typescript) - To minimize the configuration complexity of an in-browser TypeScript React app
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API) - For in-browser speech recognition
- token-flow - To run transcribed speech through a pipeline that recognizes where entities exist. 

## What this Sample Does

This sample takes inputted speech, transcribes it, and runs it through a pipeline of tokenizers which identify series of wods that exist in a catalog and tokenize them. The catalog that this sample uses is a theoretical restaurant menu 

## Data-driven

## Low Latency


### Speech as an Input Modality 
As an input modality, speech is useful in:

1. Hands-off scenarios 
    - Speaking to a conversational agent in a car
    - Asking questions of a conversational agent while cooking

2. Scenarios where speech is already the primary mode of communication
    - Help desk phone calls
    - Food ordering

Speech enabled user interfaces have the interesting side-effect of text normalization. Speech recognition services will never misspell words. Further, most SR services allow the developer to define what format of response they want. With regard to numbers, for example, SR services generally allow developers to define whether they want numeric or lexical representation (12 vs 'twelve'). When building speech enabled assistants we then need to ensuer that components downstream of speech expect the normalized speech recognition output. 

## Entity Extraction 

### Traditional Approach

Traditional NLP takes example utterances with highlighted entities to guess where an entity might lie: 

I want to book a flight from ```Seattle``` to ```Tokyo```.

We might train our NLP model to recognize that ```Seattle``` is an entity of type ```fromLocation``` and ```Tokyo``` is an entity of type ```toLocation```. With enough examples, our model would then be able to successfully "guess" where entities lie in future utterances: 

Let me get a flight from ```Miami``` to ```Lima```. 

Once we have the necessary entities, we would then pass them to some kind of "recognizer" to validate that "Miami" and "Lima" are in fact valid flight locations. This recognizer could be as simple as a regular expression, or as complex as a fuzzy search. 

### Limitations

The above approach does have limitations. In the above example, different location names might have dramatically varying lengths, and an NLP model might not pick up outliers like:

I want to fly to ```Little Cottonwood Creek Valley Utah``` and I'm coming from ``` Washington-on-the-Brazos, Texas ```.

A model is only as good as its examples, and when training data has significant outliers, they often fail to get picked up. Alternatively, envision a bot which asks a user for an order ("What would you like to order"). The user might respond, "A burger", or "A burger please" or "a burger deluxe". Unless explicitly trained for this scenario, this model will either mistakenly pick up ```burger please``` as an ```item``` entity or miss the "deluxe" in ```burger deluxe```. Attempting to train a model on every possible example often leads to overfitting and can't be the answer. 

Without any understanding the underlying entities, an NLP engine can only make guesses based on a subset of examples. But if we have a constrained number of entities in a dataset, we should be able to use that knowledge to inform our entity recognition. 

### This Approach

If you have a constrained number of entities in a dataset, then you should be able to identify where entities lie without (or before) passing an utterance into an NLP model. 

This package provides utilities to identify where entities stand in an utterance. It takes a dataset (a catalog of entities) and creates a tokenizer. The tokenizer takes an utterance and tokenizes all of the known entities in that utterance. In compiler terms, this package can be thought of as a lexer - the output is a series of tokens that a parser can then reason over. 
