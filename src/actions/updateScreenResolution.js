const updateScreenResolution = (screenResultion) => {
    return {
        type: 'UPDATE_SCREEN_RESOLUTION',
        screenResultion: screenResultion
    };
};

export default updateScreenResolution;