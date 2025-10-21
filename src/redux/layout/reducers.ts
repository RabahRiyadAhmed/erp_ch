import { LayoutActionTypes, LayoutStateTypes } from "./constants";
import {
  TwoColumnTheme,
  LayoutMode,
  LayoutTypes,
  LayoutColor,
  LayoutWidth,
  MenuPositions,
  SideBarTheme,
  SideBarTypes,
  TopbarTheme,
} from "../../constants/layout";
import { LayoutActionType } from "./actions";
import { getLayoutConfigs } from "../../utils";

// Fonction pour sauvegarder l'état dans localStorage
const saveLayoutState = (state: LayoutStateTypes) => {
  localStorage.setItem('layoutState', JSON.stringify(state));
};

// Fonction pour charger l'état depuis localStorage
const loadLayoutState = (): LayoutStateTypes | null => {
  const savedState = localStorage.getItem('layoutState');
  return savedState ? JSON.parse(savedState) : null;
};

// État initial
const INIT_STATE = loadLayoutState() || {
  twoColumnTheme: TwoColumnTheme.TWOCOLUMN_LIGHT,
  layoutMode: LayoutMode.LAYOUT_DEFAULT,
  sidenavUser: false,
  layoutType: LayoutTypes.LAYOUT_VERTICAL,
  layoutColor: LayoutColor.LAYOUT_COLOR_LIGHT,
  layoutWidth: LayoutWidth.LAYOUT_WIDTH_FLUID,
  menuPosition: MenuPositions.MENU_POSITION_FIXED,
  leftSideBarTheme: SideBarTheme.LEFT_SIDEBAR_THEME_LIGHT,
  leftSideBarType: SideBarTypes.LEFT_SIDEBAR_TYPE_DEFAULT,
  showTwoToneIcons: false,
  showSidebarUserInfo: false,
  topbarTheme: TopbarTheme.TOPBAR_THEME_DARK,
  isOpenRightSideBar: false,
};
const Layout = (
  state: LayoutStateTypes = INIT_STATE,
  action: LayoutActionType<any>
) => {
  let newState = state;

  switch (action.type) {
    case LayoutActionTypes.CHANGE_TWOCOLUMN_THEME:
      newState = {
        ...state,
        twoColumnTheme: action.payload,
      };
      break;

    case LayoutActionTypes.CHANGE_LAYOUT:
      newState = {
        ...state,
        layoutType: action.payload,
      };
      break;

    case LayoutActionTypes.CHANGE_LAYOUT_MODE:
      newState = {
        ...state,
        layoutMode: action.payload,
      };
      break;

    case LayoutActionTypes.CHANGE_LAYOUT_COLOR:
      newState = {
        ...state,
        layoutColor: action.payload,
      };
      break;

    case LayoutActionTypes.CHANGE_LAYOUT_WIDTH:
      const layoutConfig = getLayoutConfigs(action.payload);
      newState = {
        ...state,
        layoutWidth: action.payload,
        ...layoutConfig,
      };
      break;

    case LayoutActionTypes.CHANGE_MENU_POSITIONS:
      newState = {
        ...state,
        menuPosition: action.payload,
      };
      break;

    case LayoutActionTypes.CHANGE_SIDEBAR_THEME:
      newState = {
        ...state,
        leftSideBarTheme: action.payload,
      };
      break;

    case LayoutActionTypes.CHANGE_SIDEBAR_TYPE:
      newState = {
        ...state,
        leftSideBarType: action.payload,
      };
      break;

    case LayoutActionTypes.TOGGLE_SIDEBAR_USER_INFO:
      newState = {
        ...state,
        showSidebarUserInfo: action.payload,
      };
      break;

    case LayoutActionTypes.CHANGE_TOPBAR_THEME:
      newState = {
        ...state,
        topbarTheme: action.payload,
      };
      break;

    case LayoutActionTypes.TOGGLE_TWO_TONE_ICONS:
      newState = {
        ...state,
        showTwoToneIcons: action.payload,
      };
      break;

    case LayoutActionTypes.SHOW_RIGHT_SIDEBAR:
      newState = {
        ...state,
        isOpenRightSideBar: true,
      };
      break;

    case LayoutActionTypes.HIDE_RIGHT_SIDEBAR:
      newState = {
        ...state,
        isOpenRightSideBar: false,
      };
      break;

    default:
      newState = state;
      break;
  }

  // Sauvegarder le nouvel état dans localStorage
  saveLayoutState(newState);

  return newState;
};

export default Layout;