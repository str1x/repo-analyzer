import { decorate, observable } from 'mobx';

class Repository {
    constructor() {
        this.path = '';
    }
}

export default decorate(Repository, {
    path: observable,
});
