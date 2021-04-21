import { useEffect } from 'react';

//Services
import { swapChildren } from '../services';

const NavList = (props) => {
    useEffect(() => {
        const list = document.getElementById('navList'),
              listChildren = list.children;

        for(let i = 0; i < listChildren.length; i++){
            const child = listChildren[i],
                  childLastClassName = child.className.split(' ')[child.className.split.length];

            if(childLastClassName === '--active'){    
                if(i === 0){
                    swapChildren(child, listChildren[1]);
                    swapChildren(listChildren[0], listChildren[2]);
                }else{
                    if(i === 2){
                        swapChildren(child, listChildren[1]);
                        swapChildren(listChildren[2], listChildren[0]);
                    };
                };
            };
        };
    },[props]);

    return(
        <ul
            id="navList"
            className="navbar__list --flex --column --centralize-vert --full-width"
        >
            {props.children}
        </ul>
    );
};

export default NavList;