

export interface MenuItemTypes {
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
  children?: MenuItemTypes[];
  roles?: string[]; 
}
function filterMenuByRole(menu: MenuItemTypes[], userRole: string): MenuItemTypes[] {
  return menu
    .filter(item => !item.roles || item.roles.includes(userRole)) // Vérifie si le rôle est autorisé
    .map(item => ({
      ...item,
      children: item.children ? filterMenuByRole(item.children, userRole) : undefined, // Filtre les enfants
    }));
}

const HORIZONTAL_MENU_ITEMS: MenuItemTypes[] = [
  {
    key: "dashboard",
    icon: "home",
    label: "Dashboard",
    isTitle: true,
    children: [
      {
        key: "ds-dashboard-1",
        label: "Dashboard 1",
        url: "/dashboard-1",
        parentKey: "dashboard",
      },
      {
        key: "profile employee",
        label: "profile employee",
        url: "/profile_test",
        parentKey: "dashboards",
      },
    ],
  },

  {
    key: "employee",
    icon: "user",
    label: "Employee",
    isTitle: true,
    roles: ["CEO", "HR","DHR"],
    children: [
      {
        key: "employee list",
        label: "List employee",
        url: "/employee/list",
        parentKey: "employee",
       roles: ["CEO", "HR","DHR"],
      },
      {
        key: "list employee list waiting",
        label: "List wainting employee",
        url: "/employee/waiting/list",
        parentKey: "employee",
        roles: ["CEO", "HR","DHR"],
      },
      {
        key: "new employee",
        label: "List employee",
        url: "/employee/new",
        parentKey: "employee",
        roles: ["CEO", "HR","DHR"],
      },
    ],
  },


  {
    key: "request",
    icon: "mail",
    label: "Request",
    isTitle: true,
    children: [
      {
        key: "reception box",
        label: "Reception box",
        url: "/request",
        parentKey: "request",
      },
      {
        key: "compose request",
        label: "Compose request",
        url: "/request/new",
        parentKey: "request",
      },

    ],
  },

 
  {
    key: "pointage",
    icon: "mouse-pointer",
    label: "Pointage",
    isTitle: true,
    children: [

      {
        key: "pointage-list",
        label: "pointage",
        url: "/pointage",
        parentKey: "pointage",
        roles: ["CEO", "HR","DHR"],
      },
      {
        key: "invalide",
        label: "Invalide",
        url: "/invalide",
        parentKey: "pointage",
        roles: ["CEO", "HR","DHR"],
      },
    ],
  },

  {
    key: "assets",
    icon: "box",
    label: "Assets",
    isTitle: true,
    children: [

      {
        key: "assets",
        label: "assets",
        url: "/assets",
        parentKey: "assets",
      },
      {
        key: "new assets",
        label: "New assets",
        url: "/assets/new",
        parentKey: "assets",
      },
    ],
  },

  {
    key: "setting",
    icon: "box",
    label: "setting",
    isTitle: true,
    children: [

      {
        key: "setting",
        label: "setting",
        url: "/setting",
        parentKey: "setting",
      },
    ],
  },

];

const TWO_COl_MENU_ITEMS: MenuItemTypes[] = [
  {
    key: "dashboard",
    icon: "home",
    label: "Dashboard",
    isTitle: true,
    children: [
      {
        key: "ds-dashboard-1",
        label: "Dashboard 1",
        url: "/dashboard-1",
        parentKey: "dashboard",
      },
      {
        key: "profile employee",
        label: "profile employee",
        url: "/profile_test",
        parentKey: "dashboards",
      },
    ],
  },

  {
    key: "employee",
    icon: "user",
    label: "Employee",
    isTitle: true,
    roles: ["CEO", "HR","DHR"],
    children: [
      {
        key: "list employee",
        label: "List employee",
        url: "/employee/list",
        parentKey: "employee",
        roles: ["CEO", "HR","DHR"],
      },
      {
        key: "list waiting employee",
        label: "List waiting employee",
        url: "/employee/waiting/list",
        parentKey: "employee",
        roles: ["CEO", "HR","DHR"],
      },
      {
        key: "new employee",
        label: "New employee",
        url: "/employee/new",
        parentKey: "employee",
        roles: ["CEO", "HR","DHR"],
      },
    ],
  },

  {
    key: "request",
    icon: "mail",
    label: "Request",
    isTitle: true,
    children: [
      {
        key: "reception box",
        label: "Reception box",
        url: "/request",
        parentKey: "request",
      },
      {
        key: "compose request",
        label: "Compose request",
        url: "/request/new",
        parentKey: "request",
      },
    ],
  },

  {
    key: "pointage",
    icon: "mouse-pointer",
    label: "Pointage",
    isTitle: true,
    children: [

      {
        key: "pointage-list",
        label: "pointage",
        url: "/pointage",
        parentKey: "pointage",
        roles: ["CEO", "HR","DHR"],
      },
      {
        key: "invalide",
        label: "Invalide",
        url: "/invalide",
        parentKey: "pointage",
        roles: ["CEO", "HR","DHR"],
      },
    ],
  },

  {
    key: "assets",
    icon: "box",
    label: "assets",
    isTitle: true,
    children: [

      {
        key: "assets",
        label: "assets",
        url: "/assets",
        parentKey: "assets",
      },
      {
        key: "new assets",
        label: "New assets",
        url: "/assets/new",
        parentKey: "assets",
      },
    ],
  },

  {
    key: "setting",
    icon: "settings",
    label: "Setting",
    isTitle: true,
    children: [

      {
        key: "setting",
        label: "Setting",
        url: "/setting",
        parentKey: "setting",
      },
    ],
  },

  // {
  //     key: 'widgets',
  //     label: 'Widgets',
  //     isTitle: false,
  //     icon: 'gift',
  //     url: '/ui/widgets',
  // },
];




const getMenuItems = (role: string) => {

  const MENU_ITEMS: MenuItemTypes[] = [
    //////////////////////////////////////////////
    { key: "home", label: "Home", isTitle: true },
    {
      key: "dashboards",
      label: "Dashboards",
      isTitle: false,
      icon: "airplay",
      url: "/",
      badge: { variant: "success", text: "4" },
      
     
    },

    { key: "Employee", label: "Employee", isTitle: true , roles: ["CEO", "HR","DHR"],},
    {
      key: "employee",
      label: "Employee",
      isTitle: false,
      icon: "user",
      roles: ["CEO", "HR","DHR"],
      children: [

        {
          key: "list employee",
          label: "employee",
          url: "/employee/list",
          parentKey: "employee",
          roles: ["CEO", "HR","DHR"],
        },
        {
          key: "pending-contracts",
          label: "pending-contracts",
          url: "/employee/pending/list",
          parentKey: "employee",
          roles: ["CEO", "HR","DHR"],
        },
        {
          key: "list employee not valide",
          label: "list employee not valide",
          url: "/employee/waiting/list",
          parentKey: "employee",
          roles: ["CEO", "HR","DHR"],
        },

        {
          key: "new employee",
          label: "new employee",
          url: "/employee/new",
          parentKey: "employee",
          roles: ["CEO", "HR","DHR"],
        },
      
      ]
    },


    { key: "pointage", label: "Pointage", isTitle: true , roles: ["CEO", "HR","DHR"],},
    {
      key: "clock",
      label: "Pointage",
      isTitle: false,
      icon: "mouse-pointer",
      roles: ["CEO", "HR","DHR"],
      children: [

        {
          key: "pointage-list",
          label: "pointage",
          url: "/pointage",
          parentKey: "pointage",
          roles: ["CEO", "HR","DHR"],
        },
        {
          key: "invalide",
          label: "Invalide",
          url: "/invalide",
          parentKey: "pointage",
          roles: ["CEO", "HR","DHR"],
        },
        

      
      
      ]
    },


    { key: "Request", label: "Request", isTitle: true },
    {
      key: "request",
      label: "Request",
      isTitle: false,
      icon: "mail",

      children: [

        {
          key: "list request",
          label: "reception box",
          url: "/request",
          parentKey: "request",
        },

        {
          key: "compose request",
          label: "Compose request",
          url: "/request/new",
          parentKey: "request",
        },



      ]
    },

    //////////////////////////////////////////
    { key: "assets", label: "Assets", isTitle: true , roles: ["CEO", "HR","DHR"],},
    {
      key: "assets",
      label: "assets",
      isTitle: false,
      icon: "box",
      roles: ["CEO", "HR","DHR"],
      children: [

        {
          key: "assets",
          label: "Assets",
          url: "/assets",
          parentKey: "assets",
          roles: ["CEO", "HR","DHR"],
        },
        {
          key: "new asset",
          label: "New asset",
          url: "/assets/new",
          parentKey: "assets",
          roles: ["CEO", "HR","DHR"],
        },
      ]
    },


    //////////////////////////////////////////
    { key: "setting", label: "Setting", isTitle: true },
    {
      key: "setting",
      label: "Setting",
      isTitle: false,
      icon: "settings",
      children: [

        {
          key: "Setting",
          label: "Setting",
          url: "/setting",
          parentKey: "setteing",
        },
      ]
    },
    /////////////////////////////////////////

  ];
  
  return MENU_ITEMS;
};

const getHorizontalMenuItems = () => {
  // NOTE - You can fetch from server and return here as well
  return HORIZONTAL_MENU_ITEMS;
};

const getTwoColumnMenuItems = () => {
  // NOTE - You can fetch from server and return here as well
  return TWO_COl_MENU_ITEMS;
};

const findAllParent = (
  menuItems: MenuItemTypes[],
  menuItem: MenuItemTypes
): string[] => {
  let parents: string[] = [];
  const parent = findMenuItem(menuItems, menuItem["parentKey"]);

  if (parent) {
    parents.push(parent["key"]);
    if (parent["parentKey"])
      parents = [...parents, ...findAllParent(menuItems, parent)];
  }

  return parents;
};

const findMenuItem = (
  menuItems: MenuItemTypes[] | undefined,
  menuItemKey: MenuItemTypes["key"] | undefined
): MenuItemTypes | null => {
  if (menuItems && menuItemKey) {
    for (var i = 0; i < menuItems.length; i++) {
      if (menuItems[i].key === menuItemKey) {
        return menuItems[i];
      }
      var found = findMenuItem(menuItems[i].children, menuItemKey);
      if (found) return found;
    }
  }
  return null;
};

export {
  getMenuItems,
  getHorizontalMenuItems,
  getTwoColumnMenuItems,
  findAllParent,
  findMenuItem,
};
