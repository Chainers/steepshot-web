import 'es6-promise/auto';
import 'isomorphic-fetch';
import {render} from 'react-dom';
import React from 'react';
import './styles/main.css';
import createApp from './app';

/*import {whyDidYouUpdate} from 'why-did-you-update';

if (process.env.NODE_ENV !== 'production') {
	whyDidYouUpdate(React, { exclude: [/^(Connect|Link)/] });
}*/

const Root = () => (
	createApp({state: window['__INITIAL__STATE__'], props: window['__INITIAL__PROPS__']})
);

render((<Root/>), document.getElementById('root'));

if (module.hot) module.hot.accept();

