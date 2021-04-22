import { combineReducers } from 'redux';

//Reducers
import portInfoReducer from './portInfoReducer';

const allReducers = combineReducers({
    portInfo: portInfoReducer
});

export default allReducers;