
import React, {FC} from "react";
// import useDarkMode from "use-dark-mode";
import "./toggle.css";

const Toggle = () => {
  // const darkMode = useDarkMode(false);
  return (
      <div className="toggle-switch" /*onChange={darkMode.toggle}*/>
        <input type="checkbox" className="checkbox"
               name={'Dark mode'} id={'Dark mode'}/>
        <label className="label" htmlFor={'Dark mode'}>
          <span className="inner"/>
          <span className="switch"/>
        </label>
      </div>
  );
};

export default Toggle;
