import React from 'react';
import {
    Redirect,
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
                        exact path='/settings/:page'
                        component={Settings}
                    />
                    <Route
                        exact path='/weather'
                        component={Weather}
                    />
                    <Redirect to="/weather" />              
                </Switch>
            </main>
        </React.Fragment>
    );
};

export default App;