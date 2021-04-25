const updateUsername = (userLocation) => {
    return {
        type: 'UPDATE_USER_LOCATION',
        userLocation: userLocation
    };
};

export default updateUsername;