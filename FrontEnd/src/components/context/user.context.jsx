import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({children }) => {
  const [user, setUser] = useState(null)
  useEffect(() => {
      fetch("/api/channel/fetchChannel", {
              method: "GET",
              credential: "include"
          })
          .then(res => res.json())
          .then(data => {
              setUser(data.channel);
          })
          .catch(error => console.error("Error:", error))


  }, [])

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};
