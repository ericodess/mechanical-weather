//Components
import {
    SVGButton
} from '../components';

//Images
import {
    closeIcon,
    minusIcon
} from '../assets/images/icons';

const remote = window.require('@electron/remote');

const TopFrame = () => {
    const minimizeWindow = () => {
        const window = remote.getCurrentWindow();

        window.minimize();
    };

    const closeWindow = () => {
        const window = remote.getCurrentWindow();

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