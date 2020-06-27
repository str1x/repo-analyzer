import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from 'app/hooks';

const Repository = observer(() => {
    const { repository } = useStore();

    return (
        <h1>
            Repo
            {repository.path}
        </h1>
    );
});

export default Repository;
