import { useEffect } from 'react';
import image1 from '../../../Assets/Images/Home/image1.svg';

export default function Start(props) {

    useEffect(() => {
        props.animate("start");
    }, []);

    return (
        <div style={styles.step}>
            <div style={styles.content}>
                <div style={styles.h1}>Join a team by sharing an idea or skill</div>
                <div style={styles.h2}>Lorem ipsum dolor sit amet elit.</div>
                <button style={styles.button} onClick={() => props.sendMachine("CONNECT")}>
                    <div style={styles.buttonDiv}>Start now</div>
                </button>
            </div>
            <div style={styles.image}>
                <img src={image1} style={styles.logo} alt="logo" />
            </div>
        </div>
    );
}

const styles = {
    step: {
        display: 'flex',
        flexDirection: 'row',
        padding: '100px',
        marginTop: '5%',
        marginLeft: 'auto',
        marginRight: 'auto',
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
        whiteSpace: 'pre-line'
    },
    button: {
        background: 'linear-gradient(64.78deg, #05DFFC -2.86%, #0BFFC4 107.93%)',
        borderRadius: '4px',
        width: '171px',
        height: '56px',
        divAlign: 'center',
        marginTop: '20px',
        cursor: 'pointer'
    },
    buttonDiv: {
        color: '#1E1A38',
        fontFamily: 'Montserrat',
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '18px',
    }

};
