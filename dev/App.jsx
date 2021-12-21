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
        };
    }

    render() {
        return (
            <div className={'test'}>
                <SimpleDraft/>
            </div>
        );
    }
}

App.defaultProps = {
};

export default App;
