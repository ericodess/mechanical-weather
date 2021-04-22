const portInfoReducer = (state = JSON.parse(window.sessionStorage.getItem("selectedPortInfo")) === null ? {} : 
                                 JSON.parse(window.sessionStorage.getItem("selectedPortInfo")), action) => {
    switch(action.type){
        case 'UPDATE_PORT_INFO':
            const newState = action.portInfo;

            window.sessionStorage.setItem("selectedPortInfo", JSON.stringify(newState));

            return state = newState;

        default:
            return state;
    };
};

export default portInfoReducer;