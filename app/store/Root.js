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
        const data = native.openRepository(path);
        console.log(data);
        if (!canceled) {
            this.repository.path = path;
        }
    }
}
