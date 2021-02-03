import google from '../../../Assets/Images/Icons/google.svg'
import facebook from '../../../Assets/Images/Icons/facebook.svg'
import github from '../../../Assets/Images/Icons/github.svg'
import twitter from '../../../Assets/Images/Icons/twitter.svg'
import email from '../../../Assets/Images/Icons/email.svg'
import ConnectButton from '../../ConnectButton/ConnectButton'

export default function Start(props) {
    return (
        <div style={styles.step}>
            <div style={styles.content}>
                <div style={styles.h1}> Sign in </div>
                <div style={styles.h2}> Lorem ipsum dolor sit amet elit.</div>
                <ConnectButton text="Sign in with Google" icon={google} action={() => props.changeStep("contribute")} />
                <ConnectButton text="Sign in with Facebook" icon={facebook} action={() => props.changeStep("contribute")} />
                <ConnectButton text="Sign in with Github" icon={github} action={() => props.changeStep("contribute")} />
                <ConnectButton text="Sign in with Twitter" icon={twitter} action={() => props.changeStep("contribute")} />
                <ConnectButton text="Sign in with Email" icon={email} action={() => props.changeStep("contribute")} />
            </div>
        </div>
    );
}

const styles = {
    step: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: '4%',
        marginLeft: '45%',
        padding: '19px',
        zIndex: 1
    },
    content: {
        width: '480px'
    },
    h1: {
        fontFamily: 'Montserrat',
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '48px',
        lineHeight: '59px',
        color: '#ffffff',
        whiteSpace: 'pre-line'
    },
    h2: {
        fontFamily: 'Montserrat',
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '24px',
        lineHeight: '29px',
        background: 'linear-gradient(#05DFFC -2.86%, #0BFFC4 107.93%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        divShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        whiteSpace: 'pre-line',
        marginBottom: '28px'
    }
};
