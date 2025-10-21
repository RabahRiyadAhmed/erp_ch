import React, { useState, useEffect } from "react"; // Importez useState et useEffect
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import FeatherIcon from "feather-icons-react";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

/**
 * Renders the application menu
 */
interface Item {
  key: string;
  label: string;
  isTitle?: boolean;
  icon?: string;
  url?: string;
  badge?: {
    variant: string;
    text: string;
  };
  parentKey?: string;
  target?: string;
  children?: Item[];
  roles?: string[]; // Ajout des rôles pour le filtrage
}

interface AppMenuProps {
  menuItems: Item[];
  toggleMenu: (item: Item, show: boolean) => void;
  activeMenuItems: string[];
}

// Fonction de filtrage par rôle
const filterMenuByRole = (menu: Item[], userRole: string): Item[] => {
  return menu
    .filter(item => {
      // Vérifie si le menu principal a un rôle correspondant
      const hasAccessToParent = !item.roles || item.roles.includes(userRole);

      // Vérifie si le menu principal a des enfants accessibles
      const hasAccessibleChildren =
        item.children && item.children.some(child => !child.roles || child.roles.includes(userRole));

      // Le menu principal est affiché s'il a accès OU si au moins un enfant est accessible
      return hasAccessToParent || hasAccessibleChildren;
    })
    .map(item => ({
      ...item,
      children: item.children ? filterMenuByRole(item.children, userRole) : undefined, // Filtre les enfants
    }));
};

const IconMenu = ({ menuItems, toggleMenu, activeMenuItems }: AppMenuProps) => {
  const auth = useSelector((state: RootState) => state.Auth);
  const [filteredMenuItems, setFilteredMenuItems] = useState<Item[]>([]);

  // Filtrage des éléments du menu en fonction du rôle de l'utilisateur
  useEffect(() => {
    if (auth && auth.role) {
      setFilteredMenuItems(filterMenuByRole(menuItems, auth.role));
    }
  }, [auth, menuItems]);

  const onMenuItemClick = (e: React.MouseEvent, menuItem: Item) => {
    const hasChildren = menuItem.children! && menuItem.children.length;
    if (hasChildren) {
      e.preventDefault();
    }
    toggleMenu(menuItem, true);
  };

  return (
    <>
      <div className="sidebar-icon-menu">
        <div className="logo-box">
          <Link to="/">
            <img src={`${process.env.REACT_APP_API_URL}/image/logo.jpg`} alt="small logo" height="28" />
          </Link>
        </div>
        <SimpleBar className="h-100">
          <ul className="menu" id="two-col-sidenav-main">
            {(filteredMenuItems || []).map((item: Item, index: number) => {
              const activeParent =
                activeMenuItems &&
                activeMenuItems.length &&
                activeMenuItems[activeMenuItems.length - 1] === item["key"];
              return (
                <li key={index} className="menu-item nav-link-ref">
                  <Link
                    className={classNames("menu-link nav-link-ref", {
                      active: activeParent,
                    })}
                    to={item.children! ? "/#" : item.url!}
                    data-bs-title={item.label}
                    data-bs-toggle="tooltip"
                    data-bs-placement="right"
                    data-bs-trigger="hover"
                    data-menu-key={item.key}
                    onClick={(e: React.MouseEvent) => {
                      onMenuItemClick(e, item);
                    }}
                  >
                    <span className="menu-icon">
                      <FeatherIcon icon={item.icon} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </SimpleBar>
      </div>
    </>
  );
};

export default IconMenu;