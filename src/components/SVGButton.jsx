const SVGButton = (props) => {
    return(
        <button
            className={(props.className ? `${props.className} ` : '') + '--flex --centralize --smooth-transition'}
            onClick={props.onClick}
        >
            {props.inlineSVG}
        </button>
    );
};

export default SVGButton;