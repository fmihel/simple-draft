import React from 'react';
import { Edit, Btn } from 'fmihel-windeco-components';
import './DraftPanel.scss';
import { binds } from 'fmihel-browser-lib';
import DraftLine from '../Draft/DraftLine';
import DraftSize from '../Draft/DraftSize';

export default class DraftPanel extends React.Component {
    constructor(p) {
        super(p);
        binds(this, '_onChangeDraft',
            'showGenerator',
            'delete',
            'newLine',
            'addSizeV',
            'addSizeH',
            'onChangeSizeValue');
        this.state = {
            visibleView: false,
            visibleCreate: true,
            visibleLine: false,
            visibleSizeV: false,
            visibleSizeH: false,
            visibleDelete: false,
            visibleSizeValue: false,

            sizeValue: '',
        };
    }

    _onChangeDraft(o) {
        console.log('draft change', o);
        const haveLine = this.draft.list.findIndex((it) => it instanceof DraftLine) > -1;
        const current = this.draft.current();

        this.setState((prev) => ({
            ...prev,
            visibleLine: haveLine,
            visibleSizeV: haveLine,
            visibleSizeH: haveLine,
            visibleDelete: current,
            visibleSizeValue: (current instanceof DraftSize),

        }));

        if (o.event === 'select' && current instanceof DraftSize) {
            this.setState({ sizeValue: current.data.text });
        }
    }

    showGenerator() {
        if (this.props.onShowGenerator) {
            this.props.onShowGenerator();
        }
    }

    delete() {
        this.draft.delete();
    }

    newLine() {
        this.draft.add(new DraftLine(), true);
    }

    addSizeV() {
        this.draft.add(new DraftSize(true), true);
    }

    addSizeH() {
        this.draft.add(new DraftSize(false), true);
    }

    onChangeSizeValue(o) {
        this.setState({ sizeValue: o.value });
        const current = this.draft.current();
        if (current && (current instanceof DraftSize)) {
            current.data.text = o.value;
        }
    }

    set(param) {
        if ('draft' in param) {
            this.draft = param.draft;
            this.draft.addEventChange(this._onChangeDraft);
        }
    }

    componentDidMount() {
        // разовый вызов после первого рендеринга
        if (this.props.onInit) this.props.onInit({ sender: this });
    }

    componentWillUnmount() {
        // разовый после последнего рендеринга
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        // каждый раз после рендеринга (кроме первого раза !)
    }

    render() {
        const {
            visibleView,
            visibleCreate,
            visibleLine,
            visibleSizeH,
            visibleSizeV,
            visibleDelete,
            visibleSizeValue,
            sizeValue,
        } = this.state;

        return (
            <div className="draft-panel">
                {visibleView && <Btn addClass="df-btn df-btn-view" hint="просмотр">&#8629;</Btn>}
                {visibleCreate && <Btn addClass="df-btn df-btn-create" hint='создать' onClick={this.showGenerator}>&#8801;</Btn>}
                {visibleLine && <Btn addClass="df-btn df-btn-line"hint='чертить ломаную' onClick={this.newLine}>&#9998;</Btn>}
                {visibleSizeV && <Btn addClass="df-btn df-btn-size-v"hint='вертикальный размер ' onClick={this.addSizeV}>&#8597;</Btn>}
                {visibleSizeH && <Btn addClass="df-btn df-btn-size-h"hint='горизонтальный размер' onClick={this.addSizeH}>&#8596;</Btn>}
                {visibleDelete && <Btn addClass="df-btn df-btn-delete"hint='удалить' onClick={this.delete}>&#10006;</Btn>}
                {visibleSizeValue && <Edit addClass="df-edit" placeholder='значение' onChange={this.onChangeSizeValue} value={sizeValue}/>}
            </div>
        );
    }
}
DraftPanel.defaultProps = {
// default
    onInit: undefined,
    onShowGenerator: undefined,
};
