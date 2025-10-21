// constants
import { LayoutActionTypes } from "./constants";
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

// Définir le type d'action avec un payload générique
export interface LayoutActionType<TPayload> {
  type:
    | LayoutActionTypes.CHANGE_LAYOUT_MODE
    | LayoutActionTypes.CHANGE_TWOCOLUMN_THEME
    | LayoutActionTypes.CHANGE_LAYOUT
    | LayoutActionTypes.CHANGE_LAYOUT_COLOR
    | LayoutActionTypes.CHANGE_LAYOUT_WIDTH
    | LayoutActionTypes.CHANGE_MENU_POSITIONS
    | LayoutActionTypes.CHANGE_SIDEBAR_THEME
    | LayoutActionTypes.CHANGE_SIDEBAR_TYPE
    | LayoutActionTypes.TOGGLE_SIDEBAR_USER_INFO
    | LayoutActionTypes.CHANGE_TOPBAR_THEME
    | LayoutActionTypes.TOGGLE_TWO_TONE_ICONS
    | LayoutActionTypes.SHOW_RIGHT_SIDEBAR
    | LayoutActionTypes.HIDE_RIGHT_SIDEBAR;
  payload?: TPayload;
}



// Actions pour changer le mode de mise en page
export const changeLayoutModes = (mode: LayoutMode): LayoutActionType<LayoutMode> => ({
  type: LayoutActionTypes.CHANGE_LAYOUT_MODE,
  payload: mode,
});

// Actions pour changer le thème à deux colonnes
export const changeTwoColumnThemes = (mode: TwoColumnTheme): LayoutActionType<TwoColumnTheme> => ({
  type: LayoutActionTypes.CHANGE_TWOCOLUMN_THEME,
  payload: mode,
});

// Actions pour changer la disposition
export const changeLayout = (layout: LayoutTypes): LayoutActionType<LayoutTypes> => ({
  type: LayoutActionTypes.CHANGE_LAYOUT,
  payload: layout,
});

// Actions pour changer la couleur de la mise en page
export const changeLayoutColor = (color: LayoutColor): LayoutActionType<LayoutColor> => ({
  type: LayoutActionTypes.CHANGE_LAYOUT_COLOR,
  payload: color,
});

// Actions pour changer la largeur de la mise en page
export const changeLayoutWidth = (width: LayoutWidth): LayoutActionType<LayoutWidth> => ({
  type: LayoutActionTypes.CHANGE_LAYOUT_WIDTH,
  payload: width,
});

// Actions pour changer la position du menu
export const changeMenuPositions = (position: MenuPositions): LayoutActionType<MenuPositions> => ({
  type: LayoutActionTypes.CHANGE_MENU_POSITIONS,
  payload: position,
});

// Actions pour changer le thème de la barre latérale
export const changeSidebarTheme = (sidebarTheme: SideBarTheme): LayoutActionType<SideBarTheme> => ({
  type: LayoutActionTypes.CHANGE_SIDEBAR_THEME,
  payload: sidebarTheme,
});

// Actions pour changer le type de barre latérale
export const changeSidebarType = (sidebarType: SideBarTypes): LayoutActionType<SideBarTypes> => ({
  type: LayoutActionTypes.CHANGE_SIDEBAR_TYPE,
  payload: sidebarType,
});

// Actions pour activer/désactiver les informations utilisateur dans la barre latérale
export const toggleSidebarUserInfo = (showSidebarUserInfo: boolean): LayoutActionType<boolean> => ({
  type: LayoutActionTypes.TOGGLE_SIDEBAR_USER_INFO,
  payload: showSidebarUserInfo,
});

// Actions pour changer le thème de la barre supérieure
export const changeTopbarTheme = (topbarTheme: TopbarTheme): LayoutActionType<TopbarTheme> => ({
  type: LayoutActionTypes.CHANGE_TOPBAR_THEME,
  payload: topbarTheme,
});

// Actions pour activer/désactiver les icônes bicolores
export const toggleTwoToneIcons = (showTwoToneIcons: boolean): LayoutActionType<boolean> => ({
  type: LayoutActionTypes.TOGGLE_TWO_TONE_ICONS,
  payload: showTwoToneIcons,
});

// Actions pour afficher la barre latérale droite
export const showRightSidebar = (): LayoutActionType<null> => ({
  type: LayoutActionTypes.SHOW_RIGHT_SIDEBAR,
});

// Actions pour masquer la barre latérale droite
export const hideRightSidebar = (): LayoutActionType<null> => ({
  type: LayoutActionTypes.HIDE_RIGHT_SIDEBAR,
});


