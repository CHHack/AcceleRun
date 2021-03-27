
import { useRef, useState, useEffect } from "react";
import firebaseApp from "../../firebase.js";
import LinkV1 from "../LinkV1/LinkV1.js";
import "./AccountMenu.scss";

function AccountMenu(props) {
  const node = useRef();

  const signOut = async () => {
    await firebaseApp.auth().signOut();
    window.location.hash = "/";
    window.location.reload();
    // props.sendMachine("Landing");
  };

  const handleClick = e => {
    if (!props.accountMenuState || node.current.contains(e.target)) {
      return;
    }
    props.setAccountMenuState();
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [props.accountMenuState]);

  return (
    <div ref={node} className="account-menu">
      <div className="head">
        <img src={props.state.context.user.imageSource} />
        <h2>{props.state.context.user.name}</h2>
        <h3>{props.state.context.user.email}</h3>
      </div>
      <div className="button">
        <LinkV1 size="s" isDisabled={true} text="Account settings" />
        <LinkV1 size="s" isDisabled={true} text="My projects" />
        <LinkV1 size="s" isDisabled={true} text="Help" />
        <LinkV1 size="s" isDisabled={true} text="Privacy Policy" />
        <div className="footer">
          <LinkV1 size="s" isActive={false} action={() => signOut()} text="Sign out" />
        </div>
      </div>
    </div>
  )
}

export default AccountMenu
