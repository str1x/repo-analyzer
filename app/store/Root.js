import Menu from 'app/Menu';
import native from 'app/native';
import Repository from './Repository';

export default class Root {
    constructor() {
        this.menu = new Menu({
            onRepositoryOpen: this.onRepositoryOpen.bind(this),
        });
        this.repository = new Repository();
    }

    onRepositoryOpen(canceled, path) {
        if (canceled) {
            return;
        }

        try {
            const data = native.openRepository(path);
            console.log(data);
            this.repository.path = path;
        } catch (err) {
            console.warn(err);
        }
    }
}
