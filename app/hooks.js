import { useContext } from 'react';
import { storeContext } from 'app/contexts';

export const useStore = () => useContext(storeContext);
