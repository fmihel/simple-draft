import React from 'react';
import { binds } from 'fmihel-browser-lib';
import {Draft,DraftGenerator,DraftLine,DraftSize} from './Draft';
import {Draw} from './Draw';
import GeneratorForm from './GeneratorForm/GeneratorForm.jsx';


export default class SimpleDraft extends React.Component {
    constructor(p) {
        super(p);
        binds(this, 'onContextMenu',
            'onChange', 'onSelect', 'onCloseDialog', 'onGenerate');
        this.draw = undefined;
        this.draft = undefined;
        this.refCanvas = React.createRef();

        this.current = undefined;
        this.state = {
            len: '',
            showDialog: false,
        };
    }

    onGenerate(o) {
        this.draft.clear();
        new DraftGenerator(this.draft).generate({ nodes: o.nodes });
    }

    showDialog(show = true) {
        this.setState({ showDialog: show });
    }

    onCloseDialog() {
        this.showDialog(false);
    }

    onContextMenu(o) {
        o.preventDefault();
        return false;
    }

    onChange(o) {
        // if (this.current.data && this.current.data.text = o.ta)
        this.setState({ len: o.target.value });
        if (this.current && (this.current instanceof DraftSize)) {
            this.current.data.text = o.target.value;
        }
    }

    onSelect(o) {
        this.current = o.current;
        if (this.current && (this.current instanceof DraftSize)) {
            this.setState({ len: this.current.data.text });
        } else this.setState({ len: '' });
    }

    componentDidMount() {
        // разовый вызов после первого рендеринга
        this.draw = new Draw(this.refCanvas.current);
        this.draft = new Draft(this.draw);

        this.draft.onSelect = this.onSelect;
        this.draft.render();
        this.draft.add(new DraftLine(), true);
    }

    componentWillUnmount() {
        // разовый после последнего рендеринга
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        // каждый раз после рендеринга (кроме первого раза !)
    }

    render() {
        const { id, style } = this.props;
        const {
            len, showDialog, 
        } = this.state;
        return (
            <React.Fragment>
                <div className="panel">
                    <button
                        onClick={() => {
                            // const dg = new DraftGenerator(this.draft);
                            // dg.generate();
                            this.showDialog(true);
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
                            this.draft.add(new DraftLine(), true);
                        }}
                    >line</button>
                    <button
                        onClick={() => {
                            this.draft.add(new DraftSize(true), true);
                        }}
                    >size V</button>
                    <button
                        onClick={() => {
                            this.draft.add(new DraftSize(false), true);
                        }}
                    >size H</button>
                    {this.current
                    && <button
                        onClick={() => {
                            this.draft.delete();
                        }}
                    >delete</button>
                    }
                    {(this.current && this.current instanceof DraftSize) && <input type="text" onChange={this.onChange} value={len}/>}
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
                <GeneratorForm
                    visible = {showDialog}
                    onChange={this.onGenerate}
                    onClose={this.onCloseDialog}
                />
            </React.Fragment>
        );
    }
}
SimpleDraft.defaultProps = {
    id: 'canvas',
    style: {},
};
