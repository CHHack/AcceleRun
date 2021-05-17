import React, { useState, useEffect, useCallback, useRef } from "react"
import Tags from '@yaireo/tagify/dist/react.tagify';
import search from '../../assets/Images/Icons/search.svg'
import './TagsV1.scss'

export default function TagsV1(props) {
  const tagifyRef = useRef()
  const [tagifyProps, setTagifyProps] = useState({})


  const onChange = useCallback((e) => {
    if (!e.target?.value) {
      return;
    }
    props.action(JSON.parse(e.target.value));
  }, [])

  const tagifyCallbacks = {
    //add: onChange,
    //remove: onChange,
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

  const settings = {
    callbacks: tagifyCallbacks,
    blacklist: [],
    placeholder: props.placeholder,
    dropdown: {
      enabled: 0,
      maxItems: 100
    },
  }

  useEffect(() => {
    setTagifyProps({
      loading: false,
      whitelist: props.options,
      showFilteredDropdown: "a",
    });
  }, [props.placeholder])

  return (
    <div style={styles.inputContainer}>
      <div style={styles.inputTitle}>{props.title}</div>
      <div style={styles.inputWrapper}>
        <div style={styles.icon}>
          <img src={search} alt="search" />
        </div>
        <Tags
          className="input"
          style={styles.input}
          tagifyRef={tagifyRef}
          settings={settings}
          value={props.dafaultValues}
          placeholder="{props.placeholder}"
          autoFocus={false}
          {...tagifyProps}
          onChange={onChange}
        />
      </div>
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
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: '1px solid #787688',
    height: '31px',
    background: '#00000000',
    width: '100%'
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
  },
  inputWrapper: {
    position: 'relative'
  },
  icon: {
    position: 'absolute',
    left: '0px',
    top: '12px'
  }
};
