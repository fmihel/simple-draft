import React from 'react';
import { binds } from 'fmihel-browser-lib';
import {
    Draft, DraftGenerator,
} from './Draft';
import { Draw } from './Draw';
import GeneratorForm from './GeneratorForm/GeneratorForm.jsx';
import DraftPanel from './DraftPanel/DraftPanel.jsx';

export default class SimpleDraft extends React.Component {
    constructor(p) {
        super(p);
        binds(this, 'onContextMenu',
            'onDraftChange', 'onCloseDialog', 'onGenerate', 'onInitDraftPanel');
        this.draw = undefined;
        this.draft = undefined;
        this.refCanvas = React.createRef();

        this.current = undefined;
        this.state = {
            len: '',
            showDialog: false,
        };
    }

    onInitDraftPanel(o) {
        this.DraftPanel = o.sender;
    }

    onGenerate(o) {
        this.draft.clear();
        const props = { width: this.props.style.width * 0.7, height: this.props.style.height * 0.4 };
        new DraftGenerator(this.draft, props).generate({ nodes: o.nodes });
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

    onDraftChange(o) {

    }

    componentDidMount() {
        // разовый вызов после первого рендеринга
        this.draw = new Draw(this.refCanvas.current);
        const draft = new Draft(this.draw);
        this.draft = draft;
        draft.addEventChange(this.onDraftChange);
        draft.render();
        this.DraftPanel.set({ draft });
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
            showDialog,
        } = this.state;
        return (
            <React.Fragment>

                <div
                    className="canvas-frame"
                    id={id}
                    style={{
                        position: 'absolute',
                        left: 20,
                        top: 20,
                        padding: 0,
                        margin: 0,
                        ...style,
                        border: '1px dashed red',
                    }}
                >
                    <DraftPanel
                        onInit={this.onInitDraftPanel}
                        onShowGenerator={() => {
                            this.showDialog(true);
                        }}
                    />     <canvas
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
    style: {
        width: 300,
        height: 300,
    },
    onChange: undefined,
};
