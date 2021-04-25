const usernameReducer = (state = JSON.parse(window.localStorage.getItem("userInfo")) === null ? {} : 
                                 JSON.parse(window.localStorage.getItem("userInfo")), action) => {
    switch(action.type){
        case 'UPDATE_USERNAME':
            const newState = {
                username: action.username
            };

            window.localStorage.setItem("userInfo", JSON.stringify(newState));

            return state = newState;

        default:
            return state;
    };
};

export default usernameReducer;