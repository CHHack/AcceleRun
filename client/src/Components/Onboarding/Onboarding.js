import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory,
    useRouteMatch
} from "react-router-dom";
import logo from '../../Assets/Images/logo.svg';
import eclipse from '../../Assets/Images/eclipse.svg';
import Start from './Start/Start.js';
import Connect from './Connect/Connect.js';
import Contribute from './Contribute/Contribute.js';
import Info from './Info/Info';
import Idea from './Idea/Idea';

export default function Onboarding() {
    const history = useHistory();
    let match = useRouteMatch();

    const changeStep = (step) => {
        history.push(`/onboarding/${step}`);
    }

    return (
        <div style={styles.wizard}>
            <div style={styles.eclipse} >
                <img src={eclipse} alt="logo" />
            </div>
            <header>
                <img src={logo} style={styles.logo} alt="logo" />
            </header>

            <Switch>
                <Route exact path={`${match.path}`}>
                    <Start changeStep={changeStep} />
                </Route>
                <Route path={`${match.path}/connect`}>
                    <Connect changeStep={changeStep} />
                </Route>
                <Route path={`${match.path}/contribute`}>
                    <Contribute changeStep={changeStep} />
                </Route>
                <Route path={`${match.path}/info`}>
                    <Info changeStep={changeStep} />
                </Route>
                <Route path={`${match.path}/idea`}>
                    <Idea changeStep={changeStep} />
                </Route>
            </Switch>
        </div>
    );
}

const styles = {
    logo: {
        width: '167.67px'
    },
    eclipse: {
        position: 'absolute',
        left: '310px',
        top: '235px'
    },
    wizard: {
        width: '100%',
        height: '100vh',
        padding: '48px',
        backgroundColor: '#1E1A38',
        display: 'flex',
        overflowY: 'hidden',
        flexDirection: 'column'
    }
};