import { createContext } from 'react';
import RootStore from 'app/store/Root';

export const storeContext = createContext(new RootStore());
