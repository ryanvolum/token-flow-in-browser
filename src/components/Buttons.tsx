import * as React from 'react';
import { Button, Col } from 'react-bootstrap';

interface Props {
    isRecording: boolean,
    startRecognition: () => void,
    endRecognition: () => void
}

export class Buttons extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    public render() {
        return (
            <Col>
                <Button className="btn btn-success btn-lg" disabled={this.props.isRecording} onClick={this.props.startRecognition}><i className="fa fa-microphone" /> Start Recording</Button>
                <Button className="btn btn-danger btn-lg" disabled={!this.props.isRecording} onClick={this.props.endRecognition}><i className="fa fa-microphone-slash" /> Stop Recording</Button>
            </Col>
        );
    }
}