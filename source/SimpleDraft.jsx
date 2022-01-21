import React from 'react';
import { binds } from 'fmihel-browser-lib';
import _ from 'lodash';
import {
    Draft, DraftGenerator,
} from './Draft';
import { Draw } from './Draw';
import GeneratorForm from './GeneratorForm/GeneratorForm.jsx';
import DraftPanel from './DraftPanel/DraftPanel.jsx';
import DraftUtils from './Draft/DraftUtils';

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
        this.data = [];
    }

    setDraftData(data) {
        this.draft._beginChange();
        this.draft.data(data);
        this.data = _.cloneDeep(data);
        this.draft._endChange(false);
    }

    onInitDraftPanel(o) {
        this.DraftPanel = o.sender;
    }

    onGenerate(o) {
        this.draft._beginChange();

        this.draft.clear();
        const props = { width: this.props.style.width * 0.7, height: this.props.style.height * 0.4 };
        new DraftGenerator(this.draft, props).generate({ nodes: o.nodes });

        this.draft._endChange();
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

    onDraftChange() {
        const data = this.draft.data();

        if (!DraftUtils.eq(this.data, data)) {
            // this.data = _.cloneDeep(data);
            this.data = data;
            // console.log(this.data);
            if (this.props.onChange) this.props.onChange({ sender: this, data: this.data });
        }
    }

    componentDidMount() {
        // разовый вызов после первого рендеринга
        this.draw = new Draw(this.refCanvas.current);
        const draft = new Draft(this.draw);
        this.draft = draft;
        draft.addEventChange(this.onDraftChange);
        this.setDraftData(this.props.data);
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
                    visible={showDialog}
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
    data: [],

    data_example: [
        {
            name: 'DraftLine',
            data: [
                {
                    x: -105,
                    y: 90,
                    type: 'line',
                },
                {
                    x: -105,
                    y: -30,
                    type: 'line',
                },
                {
                    x: 65,
                    y: -30,
                    type: 'line',
                },
                {
                    x: 105,
                    y: -30,
                    type: 'curve',
                },
                {
                    x: 105.00000000000001,
                    y: 9.999999999999996,
                    type: 'line',
                },
                {
                    x: 105,
                    y: 90,
                    type: 'line',
                },
            ],
        },
        {
            name: 'DraftSize',
            data: {
                vert: false,
                lines: [
                    {
                        x1: -105,
                        y1: 0,
                        x2: -105,
                        y2: -70,
                    },
                    {
                        x1: 105,
                        y1: 0,
                        x2: 105,
                        y2: -70,
                    },
                ],
                arrow: {
                    a: -65,
                    a1: -105,
                    a2: 105,
                },
                text: 'xxx m',
            },
        },
        {
            name: 'DraftSize',
            data: {
                vert: true,
                lines: [
                    {
                        x2: -135,
                        y1: -30,
                        x1: 0,
                        y2: -30,
                    },
                    {
                        x2: -135,
                        y1: 100,
                        x1: 0,
                        y2: 100,
                    },
                ],
                arrow: {
                    a: -130,
                    a2: 100,
                    a1: -30,
                },
                text: 'xxx m',
            },
        },
    ],
};
