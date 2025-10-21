import React, { useEffect, useRef, useState, useCallback } from "react";
import { Col, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import FeatherIcon from "feather-icons-react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

// helpers
import { findAllParent, findMenuItem } from "../../helpers/menu";

// constants
import { MenuItemTypes } from "../../constants/menu";

// utils
import { splitArray } from "../../utils/";

// custom hook
import { useViewport } from "../../hooks/useViewPort";

// Fonction de filtrage par rôle
const filterMenuByRole = (menu: MenuItemTypes[], userRole: string): MenuItemTypes[] => {
  return menu
    .filter(item => !item.roles || item.roles.includes(userRole)) // Vérifie si le rôle est autorisé
    .map(item => ({
      ...item,
      children: item.children ? filterMenuByRole(item.children, userRole) : undefined, // Filtre les enfants
    }));
};

interface MenuItems {
  item: MenuItemTypes;
  tag?: string;
  linkClassName?: string;
  className?: string;
  subMenuClassNames?: string;
  activeMenuItems?: string[];
  toggleMenu?: (item: any, status: boolean) => void;
}

const MenuItemWithChildren = ({
  item,
  tag,
  linkClassName,
  className,
  subMenuClassNames,
  activeMenuItems,
  toggleMenu,
}: MenuItems) => {
  const Tag: any = tag;
  const { width } = useViewport();
  const [open, setOpen] = useState<boolean>(activeMenuItems!.includes(item.key));
  const showMenu = width <= 768 && open;

  const hasChild = item.children && item.children.filter(child => child.children?.length && child.children);
  const hasGrandChild = !(hasChild!.length > 0 && hasChild) && item.children!.length >= 15;
  let chunks: any[] = hasGrandChild ? splitArray(item.children!, 7) : [];

  useEffect(() => {
    setOpen(activeMenuItems!.includes(item.key));
  }, [activeMenuItems, item]);

  const toggleMenuItem = (e: any) => {
    e.preventDefault();
    const status = !open;
    setOpen(status);
    if (toggleMenu) toggleMenu(item, status);
    return false;
  };

  return (
    <Tag className={classNames(className, { "manuitem-active": activeMenuItems!.includes(item.key) })}>
      <Link
        to="/#"
        onClick={toggleMenuItem}
        data-menu-key={item.key}
        className={classNames("menu-link", linkClassName, { active: activeMenuItems!.includes(item.key) })}
        id={item.key}
        role="button"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {item.icon && (
          <span className="menu-icon">
            <FeatherIcon icon={item.icon} className="hori-icon me-1" />
          </span>
        )}
        <span className="menu-text"> {item.label} </span>
        <span className="menu-arrow"></span>
      </Link>

      {item.children &&
        (hasGrandChild ? (
          <div
            className={classNames(subMenuClassNames, "collapse collapse-lg", { show: showMenu })}
            aria-labelledby={item.key}
          >
            <Row>
              {(chunks || []).map((child, i) => (
                <Col key={i} lg={4}>
                  <MegaMenu item={child} activeMenuItems={activeMenuItems!} />
                </Col>
              ))}
            </Row>
          </div>
        ) : (
          <ul
            className={classNames("collapse sub-menu", subMenuClassNames, { show: showMenu })}
            aria-labelledby={item.key}
          >
            {(item.children || []).map((child, i) => (
              <React.Fragment key={i}>
                {child.children ? (
                  <MenuItemWithChildren
                    item={child}
                    tag="li"
                    linkClassName={classNames("dropdown-item", { "menuitem-active": activeMenuItems!.includes(child.key) })}
                    activeMenuItems={activeMenuItems}
                    className="menu-item"
                    subMenuClassNames="dropdown-menu"
                    toggleMenu={toggleMenu}
                  />
                ) : (
                  <MenuItemLink
                    item={child}
                    className={classNames("dropdown-item", { active: activeMenuItems!.includes(child.key) })}
                  />
                )}
              </React.Fragment>
            ))}
          </ul>
        ))}
    </Tag>
  );
};

const MenuItem = ({ item, className, linkClassName }: MenuItems) => {
  return (
    <li className={classNames("menu-item", className)}>
      <MenuItemLink item={item} className={linkClassName} />
    </li>
  );
};

const MenuItemLink = ({ item, className }: MenuItems) => {
  return (
    <li className={classNames("menu-item", className)}>
      <Link
        to={item.url!}
        target={item.target}
        className="menu-link"
        data-menu-key={item.key}
      >
        {item.icon && (
          <span className="menu-icon">
            <FeatherIcon icon={item.icon} className="hori-icon me-1" />
          </span>
        )}
        <span className="menu-text"> {item.label} </span>
      </Link>
    </li>
  );
};

interface MegaMenuProps {
  item: MenuItemTypes[];
  activeMenuItems: string[];
}

const MegaMenu = ({ item, activeMenuItems }: MegaMenuProps) => {
  return (
    <>
      {item.map((child, i) => (
        <MenuItemLink
          key={i}
          item={child}
          className={classNames("dropdown-item", { active: activeMenuItems!.includes(child.key) })}
        />
      ))}
    </>
  );
};

interface AppMenuProps {
  menuItems: MenuItemTypes[];
}

const AppMenu = ({ menuItems }: AppMenuProps) => {
  const location = useLocation();
  const menuRef = useRef(null);
  const auth = useSelector((state: RootState) => state.Auth);

  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItemTypes[]>([]);
  const [activeMenuItems, setActiveMenuItems] = useState<string[]>([]);

  // Filtrage des éléments du menu en fonction du rôle de l'utilisateur
  useEffect(() => {
    if (auth && auth.role) {
      setFilteredMenuItems(filterMenuByRole(menuItems, auth.role));
    }
  }, [auth, menuItems]);

  const toggleMenu = (menuItem: MenuItemTypes, show: boolean) => {
    if (show) setActiveMenuItems([menuItem.key, ...findAllParent(filteredMenuItems, menuItem)]);
  };

  const activeMenu = useCallback(() => {
    const div = document.getElementById("main-side-menu");
    let matchingMenuItem = null;

    if (div) {
      let items: any = div.getElementsByTagName("a");
      for (let i = 0; i < items.length; ++i) {
        let trimmedURL = location?.pathname?.replaceAll(process.env.PUBLIC_URL, "");
        if (trimmedURL === items[i]?.pathname?.replaceAll(process.env.PUBLIC_URL, "")) {
          matchingMenuItem = items[i];
          break;
        }
      }

      if (matchingMenuItem) {
        const mid = matchingMenuItem.getAttribute("data-menu-key");
        const activeMt = findMenuItem(filteredMenuItems, mid);
        if (activeMt) {
          setActiveMenuItems([activeMt.key, ...findAllParent(filteredMenuItems, activeMt)]);
        }
      }
    }
  }, [location.pathname, filteredMenuItems]);

  useEffect(() => {
    if (filteredMenuItems && filteredMenuItems.length > 0) activeMenu();
  }, [activeMenu, filteredMenuItems]);

  return (
    <>
      <ul className="menu" ref={menuRef} id="main-side-menu">
        {(filteredMenuItems || []).map((item, idx) => (
          <React.Fragment key={idx}>
            {item.children ? (
              <MenuItemWithChildren
                item={item}
                tag="li"
                className="menu-item"
                subMenuClassNames="dropdown-menu"
                activeMenuItems={activeMenuItems}
                linkClassName="nav-link"
                toggleMenu={toggleMenu}
              />
            ) : (
              <MenuItem
                item={item}
                className={classNames({ "menuitem-active": activeMenuItems.includes(item.key) })}
                linkClassName={classNames({ "menuitem-active": activeMenuItems.includes(item.key) })}
              />
            )}
          </React.Fragment>
        ))}
      </ul>
    </>
  );
};

export default AppMenu;