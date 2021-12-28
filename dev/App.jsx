/* eslint-disable camelcase */
/* eslint-disable import/no-extraneous-dependencies */
import {
    binds, storage,
} from 'fmihel-browser-lib';
import React from 'react';
import SimpleDraft from '../source/SimpleDraft.jsx';

class App extends React.Component {
    constructor(p) {
        super(p);
        // binds(this, 'onTheme', 'onSize', 'onClickTable', 'onClickTableFixed', 'OpenDialog', 'CloseDialog', 'undefTheme');
        this.state = {
            showDialog: false,
        };
    }

    render() {
        const { showDialog } = this.state;
        return (
            <div className={'test light normal'}>
                <SimpleDraft/>
                <div style={{ marginTop: 10, color: 'black' }}>
                    [view] - просмотр результатат ( сброс курсора)<br/>
                    [line] - войти в режим рисования кривой<br/>
                    [size V] - добавить размер по вертикали<br/>
                    [size H] - добавить размер по горизонтали<br/>

                </div>
                <div id="wd-modal" ></div>
            </div>
        );
    }
}

App.defaultProps = {
};

export default App;
