import * as React from 'react';
import { Table } from 'react-bootstrap';
import { Token } from 'token-flow';

interface Props {
    tokens?: Token[]
}

interface IncomingToken extends Token {
    children?: IncomingToken[];
    text: string;
    pid?: number;
    name?: string;
    value?: string | number;
}

interface FlatToken {
    text: string;
    type: string;
    name?: string;
    pid?: number;
    value?: string | number;
}

export class TokenTable extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    public render() {
        console.log(this.props.tokens);

        return (
            <Table hover={true} striped={true}>
                <thead>
                    <tr>
                        <th>PID</th>
                        <th>Text</th>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        // If we have tokens, render them
                        this.props.tokens
                            ? this.flattenAndRenderTokens(this.props.tokens as IncomingToken[])
                            : null
                    }
                </tbody>
            </Table>
        );
    }

    public flattenAndRenderTokens(tokens: IncomingToken[]) {
        return tokens
            .map(t => this.flattenToken(t))
            .map((t, index) => this.createTokenRow(t, index));
    }

    /**
     * If a token has children, flatten the children's "words" into a single text string
     * in the parent token. 
     * @param token 
     */
    public flattenToken(token: IncomingToken): FlatToken {
        const text =
            token.children ?
                token.children
                    .filter(child => child.text)
                    .reduce((prev, curr) => prev + " " + curr.text, "")
                : token.text;

        return {
            name: token.name || undefined,
            pid: token.pid || undefined,
            text,
            type: token.type.toString(),
            value: token.value || undefined
        }
    }

    public createTokenRow(token: FlatToken, index: number) {
        return (
            <tr key={index}>
                <td>{token.pid ? (token as any).pid : null}</td>
                <td>{token.text}</td>
                <td>{token.type.toString()}</td>
                <td>{token.name ? token.name : null}</td>
                <td>{token.value ? token.value : null}</td>
            </tr>
        )
    }
}