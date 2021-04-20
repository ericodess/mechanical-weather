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

    const closeWindows = () => {
        const window = electron.remote.getCurrentWindow();

        window.close();
    };
    
    return(
        <nav className="topframe --flex --column --full-width --justify-end --align-center">
            <button
                className="--flex --centerlize --smoth-bg"
                onClick={minimizeWindow}
            >
                {minusIcon}
            </button>
            <button
                className="--flex --centerlize --smoth-bg"
                onClick={closeWindows}
            >
                {closeIcon}
            </button>
        </nav>
    );
};

export default TopFrame;