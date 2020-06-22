import { hot } from 'react-hot-loader/root';
import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import { REPOSITORY_LIST, REPOSITORY } from '@app/constants/routes';
import { createHashHistory } from 'history';
import RepositoryList from '@app/containers/RepositoryList';
import Repository from '@app/containers/Repository';
import styled from 'styled-components';
import * as colors from '@app/constants/colors';
import * as spaces from '@app/constants/spaces';

const history = createHashHistory();

const AppLayout = styled.div`
background-color: ${colors.GREY_80};
padding: ${spaces.M};
height: 100vh;
color: ${colors.GREY_10};
font-family: system-ui;
`;

const App = () => (
    <Router history={history}>
        <AppLayout>
            <Switch>
                <Route path={REPOSITORY} component={Repository} />
                <Route path={REPOSITORY_LIST} component={RepositoryList} />
            </Switch>
        </AppLayout>
    </Router>
);

export default hot(App);
