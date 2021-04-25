import { withRouter } from 'react-router-dom';

//Compoennts
import {
    NavLink,
    NavList
} from '.';

//Icons
import {
    settingsIcon,
    temperatureIcon
} from '../assets/images/icons';

const Navbar = () => {
    return(
        <nav className="navbar --flex --column --centralize">
            <NavList>
                <NavLink dummy/>
                <NavLink
                    href='/weather'
                    content={temperatureIcon}
                />
                <NavLink
                    href='/settings/profile'
                    content={settingsIcon}
                />
            </NavList>
        </nav>
    );
};

export default withRouter(Navbar);