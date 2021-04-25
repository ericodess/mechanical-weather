const userLocationReducer = (state = JSON.parse(window.localStorage.getItem("userLocation")) === null ? {} : 
                                 JSON.parse(window.localStorage.getItem("userLocation")), action) => {
    switch(action.type){
        case 'UPDATE_USER_LOCATION':
            const newState = {
                latitude: action.userLocation.latitude,
                longitude: action.userLocation.longitude 
            };

            window.localStorage.setItem("userLocation", JSON.stringify(newState));

            return state = newState;

        default:
            return state;
    };
};

export default userLocationReducer;