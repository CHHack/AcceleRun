export default function InputV1(props) {
    return (
        <div style={styles.inputContainer}>
            <div style={styles.inputTitle}>{props.title}</div>
            <input
                type="text"
                style={styles.input}
                onChange={e => props.setValue(e.target.value)}
                value={props.inputValue}
                placeholder={props.placeholder}
            />
        </div>
    );
}

const styles = {
    input: {
        color: '#0AF8D2',
        fontFamily: 'Montserrat',
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '16px',
        borderTop:'none',
        borderLeft:'none',
        borderRight:'none',
        borderBottom: '1px solid #787688',
        height: '31px',
        background:'#00000000',
        width:'100%'
    },
    inputTitle: {
        color: '#ffffff',
        fontFamily: 'Montserrat',
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '12px'
    },
    inputContainer: {
        marginBottom: '32px'
    }
};
