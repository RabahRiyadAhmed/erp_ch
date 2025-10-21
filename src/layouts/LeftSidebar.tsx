import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";

import { getMenuItems } from "../helpers/menu";

//store
import { RootState } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import {  logout, updateToken } from '../redux/authSlice';

// constants
import { LayoutTypes } from "../constants/layout";

// components
import AppMenu from "./Menu";

import profileImg from "../assets/images/users/user-1.jpg";
import logoSm from "../assets/images/logo-sm.png";
import logoDark from "../assets/images/logo-dark.png";
import logoDark2 from "../assets/images/logo-dark-2.png";
import logoLight from "../assets/images/logo-light.png";
import logoLight2 from "../assets/images/logo-light-2.png";


import getFile from "../utils/getFile";


/* user box */
const UserBox = () => {
  const [imageUrl, setImageUrl] = useState<any>(null)
  
     const auth = useSelector((state: RootState) => state.Auth);
  // get the profilemenu
  const ProfileMenus = [
    {
      label: "My Account",
      icon: "fe-user",
      redirectTo: "/profile",
    },
    {
      label: "Settings",
      icon: "fe-settings",
      redirectTo: "#",
    },
    {
      label: "Lock Screen",
      icon: "fe-lock",
      redirectTo: "/auth/lock-screen",
    },
    {
      label: "Logout",
      icon: "fe-log-out",
      redirectTo: "/auth/logout",
    },
  ];
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  /*
   * toggle dropdown
   */
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    if (auth && auth.employeeData) {

      const url = `${process.env.REACT_APP_API_URL}/api/file/employee/profile/image`;
      getFile(url, auth.token, { id: auth.employeeData.id })
        .then((imageUrl) => {
          setImageUrl(imageUrl);

        })

    }
  }, [auth,auth.employeeData]);

  return (
    <div className="user-box text-center">
      <img
        src={imageUrl}
        alt=""
        title="Mat Helme"
        className="rounded-circle avatar-md"
      />
      <Dropdown show={dropdownOpen} onToggle={toggleDropdown}>
        <Dropdown.Toggle
          id="dropdown-notification"
          as="a"
          onClick={toggleDropdown}
          className="cursor-pointer text-dark h5 mt-2 mb-1 d-block"
        >
          {auth && auth.employeeData ? auth.employeeData.first_name + ' ' + auth.employeeData.last_name : ''}
        </Dropdown.Toggle>
        <Dropdown.Menu className="user-pro-dropdown">
          <div onClick={toggleDropdown}>
            {(ProfileMenus || []).map((item, index) => {
              return (
                <Link
                  to={item.redirectTo}
                  className="dropdown-item notify-item"
                  key={index + "-profile-menu"}
                >
                  <i className={`${item.icon} me-1`}></i>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </Dropdown.Menu>
      </Dropdown>
      <p className="text-muted">{auth && auth.employeeData && auth.employeeData.EmployeeRoles.length!=0 ? auth.employeeData.EmployeeRoles[0].Role.role_name :"/"}</p>
    </div>
  );
};

/* sidebar content */
const SideBarContent = () => {

  const [menu,setMenu] = useState<any>(getMenuItems('user'))
  const auth = useSelector((state: RootState) => state.Auth);
  useEffect(()=> {
    if(auth && auth.token) {
      setMenu(getMenuItems('user'))
    }
  },[auth])
  return (
    <>
      <UserBox />

      {/* <div id="sidebar-menu"> */}
      <AppMenu menuItems={menu} />
      {/* </div> */}

      <div className="clearfix" />
    </>
  );
};

interface LeftSidebarProps {
  isCondensed: boolean;
  hideLogo?: boolean;
}

const LeftSidebar = ({ isCondensed, hideLogo }: LeftSidebarProps) => {
  const menuNodeRef: any = useRef(null);

  const { layoutType } = useSelector((state: RootState) => ({
    layoutType: state.Layout.layoutType,
    leftSideBarType: state.Layout.leftSideBarType,
  }));

  /**
   * Handle the click anywhere in doc
   */
  const handleOtherClick = (e: any) => {
    if (
      menuNodeRef &&
      menuNodeRef.current &&
      menuNodeRef.current.contains(e.target)
    )
      return;
    // else hide the menubar
    if (document.body) {
      document.body.classList.remove("sidebar-enable");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOtherClick, false);

    return () => {
      document.removeEventListener("mousedown", handleOtherClick, false);
    };
  }, []);

  return (
    <React.Fragment>
      <div className="app-menu" ref={menuNodeRef}>
        {!hideLogo && (
          <div className="logo-box">
            <Link to="/" className="logo logo-dark text-center">
              <span className="logo-sm">
                <img src={`${process.env.REACT_APP_API_URL}/image/logo.jpg`} alt="" height="22" />
              </span>
              <span className="logo-lg">
              <img
                  src={
                    layoutType === LayoutTypes.LAYOUT_TWO_COLUMN
                      ? `${process.env.REACT_APP_API_URL}/image/logo.jpg`
                      : `${process.env.REACT_APP_API_URL}/image/logo.jpg`
                  }
                  alt=""
                  height="80"
                />
              </span>
            </Link>
            <Link to="/" className="logo logo-light text-center">
              <span className="logo-sm">
                <img src={`${process.env.REACT_APP_API_URL}/image/logo.jpg`} alt="" height="20" />
              </span>
              <span className="logo-lg">
                <img
                  src={
                    layoutType === LayoutTypes.LAYOUT_TWO_COLUMN
                      ? `${process.env.REACT_APP_API_URL}/image/logo.jpg`
                      : `${process.env.REACT_APP_API_URL}/image/logo.jpg`
                  }
                  alt=""
                  height="100"
                />
              </span>
            </Link>
          </div>
        )}

        {!isCondensed && (
          <SimpleBar className="scrollbar show h-100" scrollbarMaxSize={320} >
            <SideBarContent />
          </SimpleBar>
        )}
        {isCondensed && <SideBarContent />}
      </div>
    </React.Fragment>
  );
};

LeftSidebar.defaultProps = {
  isCondensed: false,
};

export default LeftSidebar;
