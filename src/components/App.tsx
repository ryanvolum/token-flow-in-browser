import * as React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import { Token } from 'token-flow';
import logo from '../images/logo.svg';
import { Pipeline } from '../pipeline';
import '../styles/App.css';
import { Buttons } from './Buttons';
import { TokenTable } from './TokenTable';
import { TranscribedSpeech } from './TranscribedSpeech';

interface State {
    isRecording: boolean,
    transcribedSpeech: string | undefined,
    tokens: Token[] | undefined
}

class App extends React.Component<{}, State> {
    public static SpeechRecognition = (window as any).speechRecognition || (window as any).webkitSpeechRecognition;
    private recognition: any;
    private pipeline: Pipeline;

    constructor(props: any) {
        super(props);
        this.state = {
            isRecording: false,
            tokens: [],
            transcribedSpeech: undefined
        };

        this.recognition = new App.SpeechRecognition();
        this.recognition.lang = 'en-US';
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;

        this.pipeline = new Pipeline(
            JSON.stringify(require('../data/menu.json')),
            JSON.stringify(require('../data/intents.json')),
            JSON.stringify(require('../data/attributes.json')),
            JSON.stringify(require('../data/quantifiers.json')),
            undefined,
            false);
    }

    public startRecognition = () => {
        this.setState({ isRecording: true });
        this.recognition.start();

        this.recognition.onresult = (event: any) => {
            const speechResult = event.results[0][0].transcript as string;
            this.setState({
                tokens: this.pipeline.processOneQuery(speechResult),
                transcribedSpeech: speechResult
            });
        }

        this.recognition.onspeechend = () => {
            this.setState({ isRecording: false });
            this.recognition.stop();
        }

        this.recognition.onerror = (event: any) => {
            this.setState({ isRecording: false });
        }
    }

    public endRecognition = () => {
        this.setState({ isRecording: false });
        this.recognition.stop();
    }

    public render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                </header>
                <Grid>
                    <Row className="show-grid">
                        <Col xs={6} md={4}>
                            <Buttons isRecording={this.state.isRecording} startRecognition={this.startRecognition} endRecognition={this.endRecognition} />
                        </Col>
                        <Col xs={12} md={8}>
                            <TranscribedSpeech transcribedSpeech={this.state.transcribedSpeech} />
                        </Col>
                        <TokenTable tokens={this.state.tokens} />
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default App;
