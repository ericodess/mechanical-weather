import { combineReducers } from 'redux';

//Reducers
import portInfoReducer from './portInfoReducer';
import screenResolutionReducer from './screenResolutionReducer';
import usernameReducer from './usernameReducer';
import userLocationReducer from './userLocationReducer';
import weatherInfoReducer from './weatherInfoReducer';

const allReducers = combineReducers({
    portInfo: portInfoReducer,
    screenResolution: screenResolutionReducer,
    userInfo: usernameReducer,
    userLocation: userLocationReducer,
    weatherInfo: weatherInfoReducer
});

export default allReducers;