import 'app/menu';
import Repository from './Repository';

export default class Root {
    constructor() {
        this.repository = new Repository();
    }
}
