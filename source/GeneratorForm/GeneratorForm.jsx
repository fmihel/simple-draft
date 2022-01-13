import { binds } from 'fmihel-browser-lib';
import React from 'react';
import { ModalDialog, Label, ComboBoxEx } from 'fmihel-windeco-components';
import { DG_LINE, DG_UGOL90, DG_R10 } from '../Draft/DraftGenerator';
import './GeneratorForm.scss';

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
export default class GeneratorForm extends React.Component {
    constructor(p) {
        super(p);
        binds(this, 'onChangeCount', 'onChangeNodeLeft', 'onChangeNodeRight', 'change');

        this.state = {
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

    change(lines = undefined) {
        if (this.props.onChange) {
            const nodes = (lines || this.state.lines).map((line) => ({ left: line.left.select, right: line.right.select }));
            this.props.onChange({ sender: this, nodes });
        }
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
        this.change(lines);
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
        this.change();
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
        this.change();
    }

    componentDidMount() {
        // разовый вызов после первого рендеринга
    }

    componentWillUnmount() {
        // разовый после последнего рендеринга
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        // каждый раз после рендеринга (кроме первого раза !)
    }

    render() {
        const {
            visible, onClose, stickTo,
        } = this.props;
        const { lines, count } = this.state;
        return (
            <ModalDialog
                visible = {visible}
                align= 'stickTo'
                stickTo={stickTo}
                draggable = {true}

                width = {300}
                height = {210}
                onClickShadow={onClose}
                onClickHeaderClose={onClose}

                footer={{
                    close: onClose,
                }}
            >
                <Label caption="Кол-во рядов">
                    <ComboBoxEx {...count} onChange={this.onChangeCount}/>
                </Label>
                {lines.map((line, i) => (<div key={lines[lines.length - (i + 1)].id} className="lines">
                    <div>
                        {`ряд ${lines.length - i}` }
                    </div>
                    <div>
                        <ComboBoxEx id={lines.length - (i + 1)} {...lines[lines.length - (i + 1)].left} onChange={this.onChangeNodeLeft}/>
                    </div>
                    <div>
                        <ComboBoxEx id={lines.length - (i + 1)} {...lines[lines.length - (i + 1)].right} onChange={this.onChangeNodeRight}/>
                    </div>

                </div>))}

            </ModalDialog>

        );
    }
}
GeneratorForm.defaultProps = {
    visible: true,
    onClose: undefined,
    onChange: undefined,
    stickTo: '#df-btn-create',

};
