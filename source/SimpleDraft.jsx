import React from 'react';
import { binds } from 'fmihel-browser-lib';
import Draft from './Draft';
import DrawLine from './DrawLine';
import DrawSize from './DrawSize';
import Draw from './Draw';
import DraftGenerator from './DraftGenerator';

export default class SimpleDraft extends React.Component {
    constructor(p) {
        super(p);
        binds(this, 'onContextMenu', 'onChange', 'onSelect');
        this.draw = undefined;
        this.draft = undefined;
        this.refCanvas = React.createRef();

        this.current = undefined;
        this.state = {
            len: '',
        };
    }

    onContextMenu(o) {
        // console.log(o);
        o.preventDefault();
        return false;
    }

    onChange(o) {
        // if (this.current.data && this.current.data.text = o.ta)
        this.setState({ len: o.target.value });
        if (this.current && (this.current instanceof DrawSize)) {
            this.current.data.text = o.target.value;
        }
    }

    onSelect(o) {
        this.current = o.current;
        if (this.current && (this.current instanceof DrawSize)) {
            this.setState({ len: this.current.data.text });
        } else this.setState({ len: '' });
    }

    componentDidMount() {
        // разовый вызов после первого рендеринга
        this.draw = new Draw(this.refCanvas.current);
        this.draft = new Draft(this.draw);

        this.draft.onSelect = this.onSelect;
        this.draft.render();
        this.draft.add(new DrawLine(), true);
    }

    componentWillUnmount() {
        // разовый после последнего рендеринга
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        // каждый раз после рендеринга (кроме первого раза !)
    }

    render() {
        const { id, style } = this.props;
        const { len } = this.state;
        return (
            <React.Fragment>
                <div className="panel">
                    <button
                        onClick={() => {
                            const dg = new DraftGenerator(this.draft);
                            dg.generate();
                        }}
                    >
                        gen
                    </button>
                    <button
                        onClick={() => {
                            this.draft.current('free');
                        }}
                    >view</button>
                    <button
                        onClick={() => {
                            this.draft.add(new DrawLine(), true);
                        }}
                    >line</button>
                    <button
                        onClick={() => {
                            this.draft.add(new DrawSize(true), true);
                        }}
                    >size V</button>
                    <button
                        onClick={() => {
                            this.draft.add(new DrawSize(false), true);
                        }}
                    >size H</button>
                    {this.current
                    && <button
                        onClick={() => {
                            this.draft.delete();
                        }}
                    >delete</button>
                    }
                    {(this.current && this.current instanceof DrawSize) && <input type="text" onChange={this.onChange} value={len}/>}
                </div>
                <div
                    className="canvas-frame"
                    id={id}
                    style={{
                        padding: 0,
                        margin: 0,
                        width: 500,
                        height: 200,
                        ...style,
                        border: '1px dashed red',
                    }}
                >
                    <canvas
                        id={id}
                        ref = {this.refCanvas}
                        onContextMenu={this.onContextMenu}

                    />
                </div>
            </React.Fragment>
        );
    }
}
SimpleDraft.defaultProps = {
    id: 'canvas',
    style: {},
};
