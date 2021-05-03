//Icons
import { enterIcon } from '../assets/images/icons';

const TextInput = (props) => {
    const onKeyDownHandler = (event) => {
        if(event.code === "Enter" || event.code === "NumpadEnter"){
            props.onClick();
        };
    };
    
    return(
        <div className={!props.buttonless ? "text-input --flex --row --squircle-borders --centralize-horiz" : "text-input --flex --row --squircle-borders --centralize-horiz --buttonless"}>
            <input
                id={`${props.label.toLowerCase()}Input`}
                className="text-input__input --neumorphism"
                type="text"
                name={`${props.label.toLowerCase()}Input`}
                onKeyDown={onKeyDownHandler}
            required/>
            <label
                className="text-input__label --smooth-transition"
                htmlFor={`${props.label.toLowerCase()}Input`}
            >
                {props.label}
            </label>
            {!props.buttonless ?
                <button
                    className="text-input__button --neumorphism --smooth-transition"
                    onClick={props.onClick}
                    title={props.title ? props.title : null}
                >
                    {enterIcon}
                </button>
            :
                null
            }
        </div>
    );
};

export default TextInput