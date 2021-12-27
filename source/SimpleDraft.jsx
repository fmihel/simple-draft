import React from 'react';
import { binds } from 'fmihel-browser-lib';
import { ModalDialog as Modal, Label, ComboBoxEx } from 'fmihel-windeco-components';
import Draft from './Draft';
import DrawLine from './DrawLine';
import DrawSize from './DrawSize';
import Draw from './Draw';
import DraftGenerator, { DG_LINE, DG_UGOL90, DG_R10 } from './DraftGenerator';

const lineDefaultLeft = {
    select: DG_LINE,
    list: [
        { id: DG_LINE, caption: '---' },
        { id: DG_UGOL90, caption: '|__' },
        { id: DG_R10, caption: '(__' },
    ],
};
const lineDefaultRight = {
    select: DG_LINE,
    list: [
        { id: DG_LINE, caption: '---' },
        { id: DG_UGOL90, caption: '__|' },
        { id: DG_R10, caption: '__)' },
    ],
};

export default class SimpleDraft extends React.Component {
    constructor(p) {
        super(p);
        binds(this, 'onContextMenu',
            'onChange', 'onSelect', 'onCloseDialog', 'onGen', 'onChangeCount',
            'onChangeNodeLeft', 'onChangeNodeRight');
        this.draw = undefined;
        this.draft = undefined;
        this.refCanvas = React.createRef();

        this.current = undefined;
        this.state = {
            len: '',
            showDialog: false,
            count: {
                list: [
                    { id: 0, caption: '1' },
                    { id: 1, caption: '2' },
                    { id: 2, caption: '3' },
                ],
                select: 0,
            },
            lines: [{
                id: 1,
                left: lineDefaultLeft,
                right: lineDefaultRight,
            }],
        };
    }

    onChangeNodeLeft(o) {
        const { lines } = this.state;
        lines[o.id] = {
            ...lines[o.id],
            left: {
                ...lines[o.id].left,
                select: o.select,
            },
        };
        this.setState({
            lines,
        });
    }

    onChangeNodeRight(o) {
        const { lines } = this.state;
        lines[o.id] = {
            ...lines[o.id],
            right: {
                ...lines[o.id].right,
                select: o.select,
            },
        };
        this.setState({
            lines,
        });
    }

    onChangeCount(o) {
        const lines = [];
        for (let i = 0; i < o.select + 1; i++) {
            lines.push(
                { id: i + 1, left: lineDefaultLeft, right: lineDefaultRight },
            );
        }
        this.setState({
            lines,
        });
    }

    onGen() {
        this.showDialog(false);
        const nodes = this.state.lines.map((line, i) => ({ left: line.left.select, right: line.right.select }));
        // console.log(nodes);
        this.draft.clear();
        new DraftGenerator(this.draft).generate({ nodes });
    }

    showDialog(show = true) {
        this.setState({ showDialog: show });
    }

    onCloseDialog() {
        this.showDialog(false);
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
        const {
            len, showDialog, count, lines,
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
                <Modal
                    visible = {showDialog}
                    onClickShadow={this.onCloseDialog}
                    onClickHeaderClose={this.onCloseDialog}
                    footer={{
                        generate: this.onGen,
                        close: this.onCloseDialog,
                    }}
                >
                    <Label caption="count lines">
                        <ComboBoxEx {...count} onChange={this.onChangeCount}/>
                    </Label>
                    {lines.map((line, i) => (<div key={lines[lines.length - (i + 1)].id} className="lines">
                        <div>
                            {lines.length - i }
                        </div>
                        <div>
                            <ComboBoxEx id={lines.length - (i + 1)} {...lines[lines.length - (i + 1)].left} onChange={this.onChangeNodeLeft}/>
                        </div>
                        <div>
                            <ComboBoxEx id={lines.length - (i + 1)} {...lines[lines.length - (i + 1)].right} onChange={this.onChangeNodeRight}/>
                        </div>

                    </div>))}

                </Modal>

            </React.Fragment>
        );
    }
}
SimpleDraft.defaultProps = {
    id: 'canvas',
    style: {},
};
