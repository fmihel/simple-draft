import React from 'react';
import { binds } from 'fmihel-browser-lib';
import Draft from './Draft';
import DrawLine from './DrawLine';
import DrawSize from './DrawSize';
import Draw from './Draw';

export default class SimpleDraft extends React.Component {
    constructor(p) {
        super(p);
        binds(this, 'onContextMenu');
        this.draw = undefined;
        this.draft = undefined;
        this.refCanvas = React.createRef();
    }

    onContextMenu(o) {
        // console.log(o);
        o.preventDefault();
        return false;
    }

    componentDidMount() {
        // разовый вызов после первого рендеринга
        this.draw = new Draw(this.refCanvas.current);
        this.draft = new Draft(this.draw);
        this.draft.render();
    }

    componentWillUnmount() {
        // разовый после последнего рендеринга
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        // каждый раз после рендеринга (кроме первого раза !)
    }

    render() {
        const { id, style } = this.props;
        return (
            <React.Fragment>
                <div className="panel">
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
