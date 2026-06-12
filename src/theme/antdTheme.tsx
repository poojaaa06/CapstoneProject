import React, {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from "react";
import { ConfigProvider, theme as antdTheme } from "antd";
import AppHeader from "../utils/AppHeader/app-header"; // Adjust the path accordingly

interface ThemeProviderProps {
  children: ReactNode;
}

// -------Shell Colors

// token: {
//   colorPrimary: "#FECB00", // Shell Yellow for buttons and highlights
//   colorLink: "#D52B1E", // Shell Red for links/accents
//   borderRadius: 6,
//   colorBgBase: "#1A1A1A", // Deep dark background
//   colorBgContainer: "#2C2C2C", // Cards/panels slightly lighter
//   colorBgLayout: "#1A1A1A", // Page background
//   colorBgElevated: "#2C2C2C", // Dropdowns/Popups
//   colorText: "#FFFFFF", // Default text
//   colorTextHeading: "#FECB00", // Headings in yellow (optional)
//   colorTextDescription: "#BBBBBB", // For subtext/labels
//   colorBorder: "#3A3A3A", // For dividing lines
//   fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
// },



const lightTheme = {
  token: {
    colorPrimary: "#00b96b",
    borderRadius: 4,
    colorBgContainer: "#f6ffed",
  },
};

const darkTheme = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    colorPrimary: "#00b96b",
    borderRadius: 4,
    colorBgContainer: "#000000",
    colorBgLayout: "#000000",
    colorBgElevated: "#000000",
    colorBgBase: "#000000",
    colorInputBg: "#000000",
  },
};

// Create context to store theme and toggle function
const ThemeContext = createContext({
  toggleTheme: () => {},
  theme: lightTheme, // Set initial theme
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<any>(lightTheme);

  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };

  useEffect(() => {
    if (theme === darkTheme) {
      document.body.style.backgroundColor = darkTheme.token.colorBgContainer;
    } else {
      document.body.style.backgroundColor = lightTheme.token.colorBgContainer;
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ toggleTheme, theme }}>
      <ConfigProvider theme={theme}>
        {children} {/* All children will have access to theme context */}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;