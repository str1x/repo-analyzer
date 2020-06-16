import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import App from './containers/App';

const isDev = process.env.NODE_ENV === 'development';
const AppContainer = isDev ? ReactHotAppContainer : Fragment;

document.addEventListener('DOMContentLoaded', () => render(
    <AppContainer>
        <App />
    </AppContainer>,
    document.getElementById('root'),
));
