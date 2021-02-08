export default function NextButton(props) {
    return (
        <button
            style={props.isActive ? styles.nextButton : styles.nextButtonDisabled}
            disabled={!props.isActive}
            onClick={() => props.action()}>
            Next
        </button>
    );
}


const styles = {
    nextButton: {
        cursor: 'pointer',
        width: '86px',
        height: '40px',
        fontSize: '16px',
        background: 'linear-gradient(64.78deg, #05DFFC -2.86%, #0BFFC4 107.93%)',
        borderRadius: '4px',
        border:'none',
        position:'absolute',
        bottom:'0px',
        right:'0px'
    },
    nextButtonDisabled: {
        cursor: 'pointer',
        width: '86px',
        height: '40px',
        fontSize: '16px',
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '4px',
        border:'none',
        position:'absolute',
        bottom:'0px',
        right:'0px'
    }
};
