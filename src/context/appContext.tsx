import React, { useContext, useState } from "react";

export interface AppContextProps {
  userDetails: any;
  setUserDetails: (a: any) => void;
  isMobile: boolean;
  setIsMobile: (a: any) => void;
  openProfile: boolean;
  setOpenProfile: (a: any) => void;
}

const AppContext = React.createContext<AppContextProps>({
  userDetails: [],
  setUserDetails: (a: any) => null,
  isMobile: false,
  setIsMobile: (a: any) => null,
  openProfile: false,
  setOpenProfile: (a: any) => null,
});

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider: React.FC<any> = ({ children, ...props }) => {
  const [userDetails, setUserDetails] = useState({});
  const [isMobile, setIsMobile] = useState<boolean>(true);
  const [openProfile, setOpenProfile] = useState<boolean>(false);
  return (
    <AppContext.Provider
      {...props}
      value={{
        userDetails,
        setUserDetails,
        isMobile,
        setIsMobile,
        openProfile,
        setOpenProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
