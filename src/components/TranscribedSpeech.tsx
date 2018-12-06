import * as React from 'react';

interface Props {
    transcribedSpeech?: string
}

export class TranscribedSpeech extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    public render() {
        return (
            <h1 id="output">{this.props.transcribedSpeech}</h1>
        );
    }
}