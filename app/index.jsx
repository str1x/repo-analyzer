import React from 'react';
import { render } from 'react-dom';
import './app.global.scss';

document.addEventListener('DOMContentLoaded', () => render(
    <div>
        Test react
    </div>,
    document.getElementById('root'),
));
