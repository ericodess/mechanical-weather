const screenResolutionReducer = (state = JSON.parse(window.localStorage.getItem("screenResolution")) ?? {resolution: "1280x720"}, action) => {

    switch(action.type){
        case 'UPDATE_SCREEN_RESOLUTION':
            const newState = {
                    ...state,
                    resolution: action.screenResultion
                  };
            
            return state = newState;

        default:
            return state;
    };
};

export default screenResolutionReducer;