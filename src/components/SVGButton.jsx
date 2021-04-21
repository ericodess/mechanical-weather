const SVGButton = (props) => {
    return(
        <button
            className={(props.className ? `${props.className} ` : '') + '--flex --centralize --smooth-bg'}
            onClick={props.onClick}
        >
            {props.inlineSVG}
        </button>
    );
};

export default SVGButton;