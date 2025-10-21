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

const MENU_ITEMS: MenuItemTypes[] = [
  //////////////////////////////////////////////
  {key: "home", label: "Home", isTitle: true},
  {
    key: "dashboards",
    label: "Dashboards",
    isTitle: false,
    icon: "airplay",
    badge: { variant: "success", text: "4" },
    children: [
      {
        key: "ds-dashboard-1",
        label: "Dashboard 1",
        url: "/dashboard-1",
        parentKey: "dashboards",
      },
      {
        key: "profile employee",
        label: "profile employee",
        url: "/profile_test",
        parentKey: "dashboards",
      },
    ]
  },

  {key: "Employee", label: "Employee", isTitle: true},
  {
    key: "employee",
    label: "Employee",
    isTitle: false,
    icon: "user",
    
    children: [
    
      {
        key: "list employee",
        label: "employee",
        url: "/employee/list",
        parentKey: "employee",
      },
          
      {
        key: "list employee not valide",
        label: "employee en 2",
        url: "/employee/waiting/list",
        parentKey: "employee",
      },
          
      {
        key: "new employee",
        label: "new employee",
        url: "/employee/new",
        parentKey: "employee",
      },

    ]
  },

  {key: "Request", label: "Request", isTitle: true},
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
  {key: "assets", label: "Assets", isTitle: true},
  {
    key: "assets",
    label: "assets",
    isTitle: false,
    icon: "box",
    children: [
    
      {
        key: "assets",
        label: "Assets",
        url: "/assets",
        parentKey: "assets",
      },
      {
        key: "new asset",
        label: "New asset",
        url: "/assets/new",
        parentKey: "assets",
      },
    ]
  },


  //////////////////////////////////////////
  {key: "setting", label: "Setting", isTitle: true},
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
    children: [
      {
        key: "employee list",
        label: "List employee",
        url: "/employee/list",
        parentKey: "employee",
      },
      {
        key: "list employee list waiting",
        label: "List wainting employee",
        url: "/employee/waiting/list",
        parentKey: "employee",
      },
      {
        key: "new employee",
        label: "List employee",
        url: "/employee/new",
        parentKey: "employee",
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
    children: [
      {
        key: "list employee",
        label: "List employee",
        url: "/employee/list",
        parentKey: "employee",
      },
      {
        key: "list waiting employee",
        label: "List waiting employee",
        url: "/employee/waiting/list",
        parentKey: "employee",
      },
      {
        key: "new employee",
        label: "New employee",
        url: "/employee/new",
        parentKey: "employee",
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
    key: "assets",
    icon: "assets",
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

export { MENU_ITEMS, TWO_COl_MENU_ITEMS, HORIZONTAL_MENU_ITEMS };
