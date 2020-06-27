import { decorate, observable } from 'mobx';
import naitive from 'app/native';

class Repository {
    constructor() {
        this.path = naitive.hello();
    }
}

export default decorate(Repository, {
    path: observable,
});
