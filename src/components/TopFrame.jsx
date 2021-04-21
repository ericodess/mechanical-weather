//Components
import {
    SVGButton
} from '../components';

//Images
import {
    closeIcon,
    minusIcon
} from '../assets/images/icons';

const electron = window.require("electron");

const TopFrame = () => {
    const minimizeWindow = () => {
        const window = electron.remote.getCurrentWindow();

        window.minimize();
    };

    const closeWindow = () => {
        const window = electron.remote.getCurrentWindow();

        window.close();
    };
    
    return(
        <nav className="topframe --flex --row --full-width --justify-end --centralize-horiz">
            <SVGButton
                onClick={minimizeWindow}
                inlineSVG={minusIcon}
            />
            <SVGButton
                onClick={closeWindow}
                inlineSVG={closeIcon}
            />
        </nav>
    );
};

export default TopFrame;