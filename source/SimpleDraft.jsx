import './SimpleDraft.scss';
import React from 'react';
import { binds, JX } from 'fmihel-browser-lib';
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
            startBtn: {
                width: 0,
                height: 0,
                display: 'flex',
            },
        };
        this.data = [];
    }

    setDraftData(data) {
        this.draft._beginChange();
        const setData = DraftUtils.fixedNumField(data);
        this.draft.data(setData);
        this.data = setData;
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
        this.startBtnResize();
    }

    startBtnResize() {
        const visible = this.draft.list.length === 0;
        if (!visible) {
            if (this.state.startBtn.display !== 'none') {
                this.setState({
                    startBtn: {
                        ...this.startBtn,
                        display: 'none',
                    },
                });
            }
        } else if (this.refCanvas.current) {
            const dom = this.refCanvas.current;
            const pos = JX.abs(dom);

            const current = {
                ...this.state.startBtn,
                width: pos.w,
                height: pos.h,
                display: 'flex',
            };
            if (!_.isEqual(this.state.startBtn, current)) {
                this.setState({ startBtn: current });
            }
        }
    }

    componentDidMount() {
        // ?????????????? ?????????? ?????????? ?????????????? ????????????????????
        this.draw = new Draw(this.refCanvas.current);
        const draft = new Draft(this.draw);
        this.draft = draft;
        draft.addEventChange(this.onDraftChange);
        this.setDraftData(this.props.data);
        draft.render();
        this.DraftPanel.set({ draft });
        // console.log('fixed', this.props.data_example[0].data, DraftUtils.fixedNumField(this.props.data_example)[0].data);
        this.startBtnResize();
    }

    componentWillUnmount() {
        // ?????????????? ?????????? ???????????????????? ????????????????????
        this.draw.free();
        console.log('free');
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        // ???????????? ?????? ?????????? ???????????????????? (?????????? ?????????????? ???????? !)
        // console.log('fixed', DraftUtils.fixedNumField(this.props.data_example));
        this.startBtnResize();
    }

    render() {
        const { id, style } = this.props;
        const {
            showDialog,
            startBtn,
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
                        border: '1px solid gray',
                    }}
                >
                    <DraftPanel
                        onInit={this.onInitDraftPanel}
                        onShowGenerator={() => {
                            this.showDialog(true);
                        }}
                    />
                    <canvas
                        id={id}
                        ref = {this.refCanvas}
                        onContextMenu={this.onContextMenu}
                    />
                    <div
                        id="draft-start-btn"
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            ...startBtn,
                        }}
                        onClick={() => {
                            this.showDialog(true);
                        }}
                    >
                        <div>??????????????, ?????? ???????????????? ????????????..</div>
                    </div>
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
                    x: '-105',
                    y: '90',
                    type: 'line',
                },
                {
                    x: '-105.83920204902',
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
                align: 'horiz',
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
                align: 'vert',
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
