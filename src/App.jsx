import React from 'react';
import {
    Route,
    Switch
} from 'react-router-dom';

//Components
import {
    Navbar,
    TopFrame,
    WeatherStatus
} from './components';

//Views
import {
    Settings,
    Weather
} from './views';

const App = () => {
    return(
        <React.Fragment>
            <header>
                <TopFrame />
                <WeatherStatus />
                <Navbar />
            </header>
            <main>
                <Switch>
                    <Route
                        exact path='/'
                        component={Weather}
                    />
                    <Route
                        exact path='/settings'
                        component={Settings}
                    />
                </Switch>
            </main>
        </React.Fragment>
    );
};

export default App;