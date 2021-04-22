const fade = async (element, time) => {
    time = time ?? 50;

    let opacity = 1;

    const timer = setInterval(() => {
        if(opacity <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
            return true;
        };

        element.style.opacity = opacity.toString();
        element.style.filter = 'alpha(opacity=' + opacity * 100 + ")";
        opacity -= opacity * 0.1;
    }, time);
};

export default fade;