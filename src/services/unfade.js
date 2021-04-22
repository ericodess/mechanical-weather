const unfade = async (element, time) => {
    time = time ?? 50;

    let opacity = 0.1;

    element.style.display = 'flex';

    const timer = setInterval(() => {
        if(opacity >= 1){
            clearInterval(timer);
            return true;
        };

        element.style.opacity = opacity.toString();
        element.style.filter = 'alpha(opacity=' + opacity * 100 + ")";
        opacity += opacity * 0.1;
    }, time);
};

export default unfade