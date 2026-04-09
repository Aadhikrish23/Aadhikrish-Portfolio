import { createContext,useContext,useState,useEffect, useRef } from "react";
import healthcheckApi from "../APIServices/healthcheck.api";
type ServerContextType = {
  serverReady: boolean;
  connected: boolean;
};

const serverContext = createContext<ServerContextType| null>(null);

export const ServerProvider = ({children}:{children:React.ReactNode})=>{
     const [serverReady, setServerReady] = useState(false);
  const [connected, setConnected] = useState(false);

  const attemptsRef = useRef(0); 

  useEffect(() => {
    const healthcheck = async () => {
      try {
        const res = await healthcheckApi.healthCheck();

        if (res.data.status === "OK") {
          setConnected(true);

          setTimeout(() => {
            setServerReady(true); 
          }, 1000);
        } else {
          retry();
        }
      } catch (error) {
        retry();
      }
    };

    const retry = () => {
      attemptsRef.current++;

      if (attemptsRef.current < 20) {
        setTimeout(healthcheck, 2000);
      }
    };

    healthcheck();
  }, []);


  return (
    <serverContext.Provider
    value={{serverReady,connected}}>
        {children}
    </serverContext.Provider>
  )
}
export const useServerStatus = () => {
  const context = useContext(serverContext);

  if (!context) {
    throw new Error("useServerStatus must be used within ServerProvider");
  }

  return context;
};