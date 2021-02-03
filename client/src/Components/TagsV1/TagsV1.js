import React, { useState, useEffect, useCallback, useRef } from "react"
import Tags from '@yaireo/tagify/dist/react.tagify';
import './TagsV1.scss'


const tagifyCallbacks = {
  // add: callback,
  // remove: callback,
  // input: callback,
  // edit: callback,
  // invalid: callback,
  // click: callback,
  // keydown: callback,
  // focus: callback,
  // blur: callback,
  // "edit:input": callback,
  // "edit:updated": callback,
  // "edit:start": callback,
  // "edit:keydown": callback,
  // "dropdown:show": callback,
  // "dropdown:hide": callback,
  // "dropdown:select": callback
}

export default function TagsV1(props) {
  const tagifyRef = useRef()
  const [tagifySettings, setTagifySettings] = useState([])
  const [tagifyProps, setTagifyProps] = useState({})

  const baseTagifySettings = {
    blacklist: [],
    //backspace: "edit",
    placeholder:  props.placeholder,
    dropdown: {
      enabled: 0
    }
  }

  useEffect(() => {
    setTagifyProps({
      loading: false,
      whitelist: props.options,
      showFilteredDropdown: "a",
    });
  }, [])


  const settings = {
    ...baseTagifySettings,
    ...tagifySettings,
    callbacks: tagifyCallbacks
  }

  const onChange = useCallback((e) => {
    e.persist();
    console.log("CHANGED:", e.target.value);
    props.action(e.target.value);
  }, [])

  return (
    <div style={styles.inputContainer}>
      <div style={styles.inputTitle}>{props.title}</div>
      <Tags
        className="input"
        style={styles.input}
        tagifyRef={tagifyRef}
        settings={settings}
        value=""
        autoFocus={true}
        {...tagifyProps}
        onChange={onChange}
      />
    </div>
  )
};



const styles = {
  input: {
      color: '#ffffff',
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
