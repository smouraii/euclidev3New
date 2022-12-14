import { toAbsoluteUrl } from "../utils/utils";

export const initLayoutConfig = {
  demo: "demo4",
  // Base Layout
  colors: {
    state: {
      brand: "#366cf3",
      light: "#ffffff",
      dark: "#282a3c",

      primary: "#5867dd",
      success: "#34bfa3",
      info: "#36a3f7",
      warning: "#ffb822",
      danger: "#fd3995"
    },
    base: {
      label: ["#c5cbe3", "#a1a8c3", "#3d4465", "#3e4466"],
      shape: ["#f0f3ff", "#d9dffa", "#afb4d4", "#646c9a"]
    }
  },
  self: {
    body: {
      "background-image": toAbsoluteUrl("/media/demos/demo4/header.jpg")
    }
  },
  loader: {
    enabled: true,
    type: "brand"
  },
  // Page toolbar
  toolbar: {
    display: true
  },
  header: {
    self: {
      width: "fluid", // fixed|fluid
      fixed: {
        desktop: {
          enabled: true,
          mode: "menu" //supported modes: all, topbar, menu
        },
        mobile: true
      }
    },
    menu: {
      self: {
        display: true,
        "root-arrow": false,
        "icon-style": "duotone"
      },
      desktop: {
        arrow: true,
        toggle: "click",
        submenu: {
          skin: "light",
          arrow: true
        }
      },
      mobile: {
        submenu: {
          skin: "dark",
          accordion: true
        }
      }
    }
  },
  subheader: {
    display: true,
    layout: "subheader-v1",
    fixed: true,
    width: "fluid", //fixed|fluid
    layouts: {
      "subheader-v1": "Subheader v1",
      "subheader-v2": "Subheader v2",
      "subheader-v3": "Subheader v3",
      "subheader-v4": "Subheader v4"
    },
    style: "transparent" // transparent|solid
  },
  // Content
  content: {
    width: "fluid" // fixed/fluid
  },
  footer: {
    self: {
      width: "fluid", // fixed|fluid
      layout: "extended" // extended|basic
    }
  },
  aside: {
    self: {
      fixed: false
    },
    menu: {
      dropdown: true
    }
  }
};

let LayoutConfig = JSON.parse(JSON.stringify(initLayoutConfig)); // deep object copy
export default LayoutConfig;
