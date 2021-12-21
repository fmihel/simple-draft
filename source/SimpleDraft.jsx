import React from 'react';
import { binds } from 'fmihel-browser-lib';
import Draws from './Draws';
import DrawLine from './DrawLine';
import Draw from './Draw';

export default class SimpleDraft extends React.Component {
    constructor(p) {
        super(p);
        binds(this, 'onContextMenu');
        this.draw = undefined;
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
        this.draw.animate(() => {
            const { draw } = this;
            draw.grid(20);
            draw.color('#ff0000');
            draw.text('(-20;-30)', -20, -30);
            draw.circle(-20, -30, 2);
            draw.text('(0;0)', 0, -10);
            draw.text('X', 100, -10);
            draw.text('Y', -10, 100);
            draw.line(-250, 0, 250, 0);
            draw.line(0, -250, 0, 250);
            draw.point(10, 10);
        });
    }

    componentWillUnmount() {
        // разовый после последнего рендеринга
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        // каждый раз после рендеринга (кроме первого раза !)
    }

    render() {
        const { id } = this.props;
        return (
            <canvas
                id={id}
                ref = {this.refCanvas}
                onContextMenu={this.onContextMenu}
                style={{
                    width: 300,
                    height: 200,
                }}
            />
        );
    }
}
SimpleDraft.defaultProps = {
    id: 'canvas',

};
