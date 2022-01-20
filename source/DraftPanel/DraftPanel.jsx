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
            'onChangeSizeValue',
            'setNodeCurve',
            'setNodeLine',
            'deleteNode');
        this.state = {
            visibleView: false,
            visibleCreate: true,
            visibleLine: false,
            visibleSizeV: false,
            visibleSizeH: false,
            visibleDelete: false,
            visibleSizeValue: false,
            visibleNodeCurve: false,
            visibleNodeLine: false,
            visibleDeleteNode: false,
            sizeValue: '',
        };
    }

    current() {
        return this.draft.current();
    }

    currentNode() {
        const current = this.current();
        return ((current && current.name === 'DraftLine') ? current.currentNode() : false);
    }

    _onChangeDraft(o) {
        const haveLine = this.draft.list.findIndex((it) => it.name === 'DraftLine') > -1;
        const current = this.current();
        const currentNode = this.currentNode();

        this.setState((prev) => ({
            ...prev,
            visibleLine: haveLine && !current,
            visibleSizeV: haveLine && !current,
            visibleSizeH: haveLine && !current,
            visibleDelete: current && !currentNode,
            visibleDeleteNode: currentNode,
            visibleSizeValue: (current && current.name === 'DraftSize'),
            visibleNodeCurve: currentNode && current.isNotBorderNode(currentNode) && currentNode.type === 'line',
            visibleNodeLine: currentNode && current.isNotBorderNode(currentNode) && currentNode.type === 'curve',

        }));

        if (o.event === 'select' && current && current.name === 'DraftSize') {
            this.setState({ sizeValue: current._data.text });
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

    deleteNode() {
        const currentNode = this.currentNode();
        if (currentNode) {
            this.current().delete(currentNode);
        }
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
        const current = this.current();
        if (current && current.name === 'DraftSize') {
            current._data.text = o.value;
            this.draft._doChange();
        }
    }

    setNodeCurve() {
        const current = this.current();
        const currentNode = this.currentNode();
        if (currentNode) {
            current.setNodeAsCurve(currentNode);
        }
    }

    setNodeLine() {
        const current = this.current();
        const currentNode = this.currentNode();
        if (currentNode) {
            current.setNodeAsLine(currentNode);
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
            visibleDeleteNode,
            visibleSizeValue,
            visibleNodeCurve,
            visibleNodeLine,
            sizeValue,
        } = this.state;

        return (
            <div className="draft-panel">
                {visibleView && <Btn addClass="df-btn df-btn-view" hint="просмотр">&#8629;</Btn>}
                {visibleCreate && <Btn id='df-btn-create' addClass="df-btn df-btn-create" hint='создать' onClick={this.showGenerator}>&#8801;</Btn>}
                {visibleLine && <Btn addClass="df-btn df-btn-line"hint='чертить ломаную' onClick={this.newLine}>&#9998;</Btn>}
                {visibleSizeV && <Btn addClass="df-btn df-btn-size-v"hint='вертикальный размер ' onClick={this.addSizeV}>&#8597;</Btn>}
                {visibleSizeH && <Btn addClass="df-btn df-btn-size-h"hint='горизонтальный размер' onClick={this.addSizeH}>&#8596;</Btn>}
                {visibleSizeValue && <Edit addClass="df-edit" placeholder='значение' disable= {{ dim: true }}
                    onChange={this.onChangeSizeValue} value={sizeValue}/>}
                {visibleNodeCurve && <Btn addClass="df-btn df-btn-node-curve"hint='скруглить' onClick={this.setNodeCurve}>&#8978;</Btn>}
                {visibleNodeLine && <Btn addClass="df-btn df-btn-node-line"hint='выпрямить' onClick={this.setNodeLine}>&#8212;</Btn>}
                {visibleDelete && <Btn addClass="df-btn df-btn-delete"hint='удалить' onClick={this.delete}>&#10006;</Btn>}
                {visibleDeleteNode && <Btn addClass="df-btn df-btn-delete-node"hint='удалить точку' onClick={this.deleteNode}>&#10062;</Btn>}
            </div>
        );
    }
}
DraftPanel.defaultProps = {
// default
    onInit: undefined,
    onShowGenerator: undefined,
};
