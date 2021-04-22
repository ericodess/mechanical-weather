import { Link } from 'react-router-dom';

const NavLink = (props) => {
    const currentPage = window.location.pathname;

    if(props.dummy){
        return(
            <li className="navbar__link-dummy"/>
        );
    }else{
        return(
            <li className={"navbar__link --smooth-transition" + (currentPage === props.href ? ' --active' : '')}>
                <Link
                    className="--full-width --full-height --flex --centralize"
                    to={props.href}
                    rel="noreferrer"
                    target={props.isAnotherWindow ? '_blank' : null}
                >
                    {props.content}
                </Link>
            </li>
        );
    };
};

export default NavLink;