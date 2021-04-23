import { combineReducers } from 'redux';

//Reducers
import portInfoReducer from './portInfoReducer';
import screenResolutionReducer from './screenResolutionReducer';

const allReducers = combineReducers({
    portInfo: portInfoReducer,
    screenResolution: screenResolutionReducer
});

export default allReducers;