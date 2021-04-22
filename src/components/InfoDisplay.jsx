//Services
import { convertCamelToPhrase } from '../services';

const InfoDisplay = (props) => {
    if(Object.entries(props.info).length > 0){
        return(
            <ul className="info-display --flex --column --centralize-vert">
                {Object.entries(props.info).map((info, index) => {
                    return(
                        <li
                            key={index}
                            className="info-display__text --flex --row --full-width"
                        >
                            <span>{convertCamelToPhrase(info[0])}:</span><span>{info[1] ? info[1] : '-'}</span>
                        </li>
                    );
                })}
            </ul>
        );
    }else{
        return(
            <div className="info-display --flex --column --centralize">
                <span className="info-display__feedback">{props.errorMessage}</span>
            </div>
        );
    };
};

export default InfoDisplay;