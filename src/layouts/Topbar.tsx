import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {  logout, updateToken } from '../redux/authSlice';
// import classNames from 'classnames';

// actions
import { showRightSidebar, changeSidebarType } from "../redux/actions";

// store
import { RootState, AppDispatch } from "../redux/store";

//constants
import { LayoutTypes, SideBarTypes } from "../constants/layout";

// components
import TopbarSearch from "../components/TopbarSearch";
import MaximizeScreen from "../components/MaximizeScreen";
import AppsDropdown from "../components/AppsDropdown/";
// import SearchDropdown from '../components/SearchDropdown';
import LanguageDropdown from "../components/LanguageDropdown";
import Notification from "../components/erp/Notification";
import ProfileDropdown from "../components/ProfileDropdown";
import CreateNew from "../components/CreateNew";
import MegaMenu from "../components/MegaMenu";

import profilePic from "../assets/images/users/user-1.jpg";
import avatar4 from "../assets/images/users/user-4.jpg";
import logoSm from "../assets/images/logo-sm.png";
import logoDark from "../assets/images/logo-dark.png";
import logoDark2 from "../assets/images/logo-dark-2.png";
import logoLight from "../assets/images/logo-light.png";
import logoLight2 from "../assets/images/logo-light-2.png";
import { useViewport } from "../hooks/useViewPort";


import getFile from "../utils/getFile";
export interface NotificationItem {
  id: number;
  text: string;
  subText: string;
  icon?: string;
  avatar?: string;
  bgColor?: string;
}


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

interface TopbarProps {
  hideLogo?: boolean;
  navCssClasses?: string;
  openLeftMenuCallBack?: () => void;
  topbarDark?: boolean;
}

const Topbar = ({
  hideLogo,
  navCssClasses,
  openLeftMenuCallBack,
  topbarDark,
}: TopbarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { width } = useViewport();
  const [imageUrl, setImageUrl] = useState<any>(null)
  const auth = useSelector((state: RootState) => state.Auth);
  const navbarCssClasses: string = navCssClasses || "";
  const containerCssClasses: string = !hideLogo ? "container-fluid" : "";

  const { layoutType, leftSideBarType } = useSelector((state: RootState) => ({
    layoutType: state.Layout.layoutType,
    leftSideBarType: state.Layout.leftSideBarType,
  }));


  /**
   * Toggle the leftmenu when having mobile screen
   */
  const handleLeftMenuCallBack = () => {
    if (width < 1140) {
      if (leftSideBarType === 'full') {
        showLeftSideBarBackdrop();
        document.getElementsByTagName("html")[0].classList.add("sidebar-enable");
      }
      else {
        dispatch(changeSidebarType(SideBarTypes.LEFT_SIDEBAR_TYPE_FULL));
      }
    } else if (leftSideBarType === "condensed") {
      dispatch(changeSidebarType(SideBarTypes.LEFT_SIDEBAR_TYPE_DEFAULT));
    } else if (leftSideBarType === 'full') {
      showLeftSideBarBackdrop();
      document.getElementsByTagName("html")[0].classList.add("sidebar-enable");
    } else if (leftSideBarType === 'fullscreen') {
      dispatch(changeSidebarType(SideBarTypes.LEFT_SIDEBAR_TYPE_DEFAULT));
      // showLeftSideBarBackdrop();
      document.getElementsByTagName("html")[0].classList.add("sidebar-enable");
    }
    else {
      dispatch(changeSidebarType(SideBarTypes.LEFT_SIDEBAR_TYPE_CONDENSED));
    }
  };

  // create backdrop for leftsidebar
  function showLeftSideBarBackdrop() {
    const backdrop = document.createElement("div");
    backdrop.id = "custom-backdrop";
    backdrop.className = "offcanvas-backdrop fade show";
    // backdrop.style.zIndex = '999'
    document.body.appendChild(backdrop);

    if (
      document.getElementsByTagName("html")[0]?.getAttribute("dir") !== "rtl"
    ) {
      document.body.style.overflow = "hidden";
      if (width > 1140) {
        document.body.style.paddingRight = "15px";
      }
    }

    backdrop.addEventListener("click", function (e) {
      document.getElementsByTagName("html")[0].classList.remove("sidebar-enable");
      dispatch(changeSidebarType(SideBarTypes.LEFT_SIDEBAR_TYPE_FULL));
      hideLeftSideBarBackdrop();
    });
  }

  function hideLeftSideBarBackdrop() {
    var backdrop = document.getElementById("custom-backdrop");
    if (backdrop) {
      document.body.removeChild(backdrop);
      document.body.style.overflow = "visible";
    }
  }

  /**
   * Toggles the right sidebar
   */
  const handleRightSideBar = () => {
    dispatch(showRightSidebar());
  };

  /**
   * Toggles the left sidebar width
   */
  // const toggleLeftSidebarWidth = () => {
  //   if (leftSideBarType === 'default' || leftSideBarType === 'compact')
  //     dispatch(changeSidebarType(SideBarTypes.LEFT_SIDEBAR_TYPE_CONDENSED));
  //   if (leftSideBarType === 'condensed') dispatch(changeSidebarType(SideBarTypes.LEFT_SIDEBAR_TYPE_DEFAULT));
  // };
  useEffect(() => {
    if (auth && auth.employeeData) {

      const url = `${process.env.REACT_APP_API_URL}/api/file/employee/profile/image`;
      getFile(url, auth.token, { id: auth.employeeData.id })
        .then((image) => {
          setImageUrl(image);

        })

    }
  }, []);

  return (
    <React.Fragment>
      <div className={`navbar-custom ${navbarCssClasses}`}>
        <div className={`topbar ${containerCssClasses}`}>
          <div className="topbar-menu d-flex align-items-center gap-1">
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
                      height="44"
                    />
                  </span>
                </Link>
                <Link to="/" className="logo logo-light text-center">
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
                      height="44"
                    />
                  </span>
                </Link>
              </div>
            )}

            <button
              className="button-toggle-menu"
              onClick={handleLeftMenuCallBack}
            >
              <i className="mdi mdi-menu" />
            </button>

            {/*<div className="dropdown d-none d-xl-block">
              <CreateNew otherOptions={otherOptions} />
            </div>

            <div className="dropdown dropdown-mega d-none d-xl-block">
              <MegaMenu subMenus={MegaMenuOptions} />
            </div>*/}
          </div>

          <ul className="topbar-menu d-flex align-items-center">
            {/*<li className="app-search dropdown d-none d-lg-block">
              <TopbarSearch items={SearchResults} />
            </li>
             <li className="dropdown d-inline-block d-lg-none">
              <SearchDropdown />
            </li> */}
            <li className="dropdown d-none d-lg-inline-block">
              <MaximizeScreen />
            </li>
            { /* <li className="dropdown d-none d-lg-inline-block topbar-dropdown">
              <AppsDropdown />
            </li>*/}
           <li className="dropdown d-none d-lg-inline-block topbar-dropdown">
              <LanguageDropdown />
            </li>
            <li className="dropdown notification-list">
              <Notification />
            </li>
            <li className="dropdown">
              <ProfileDropdown
                profilePic={imageUrl ? imageUrl : `${process.env.REACT_APP_API_URL}/image/profile.jpg`}
                menuItems={ProfileMenus}
                username={auth && auth.employeeData ? auth.employeeData.first_name + ' ' + auth.employeeData.last_name : ''}
                userTitle={"Founder"}
              />
            </li>
            {/*<li>
              <button
                className="nav-link dropdown-toggle right-bar-toggle waves-effect waves-light btn btn-link shadow-none"
                onClick={handleRightSideBar}
              >
                <i className="fe-settings noti-icon font-22"></i>
              </button>
            </li>*/}
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Topbar;
