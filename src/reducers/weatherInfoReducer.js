const weatherInfoReducer = (state = {}, action) => {
    switch(action.type){
        case 'UPDATE_WEATHER_INFO':
            const newState = action.weatherInfo;

            return state = newState;

        default:
            return state;
    };
};

export default weatherInfoReducer;