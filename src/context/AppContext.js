import axios from 'axios';
import moment from 'moment';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export const AppContext = createContext();


export const AppProvider = ({ children }) => {

   const apiUrl = 'http://192.168.1.108/api/data';
   // const apiUrl = 'data.json';


   const [realTimeData, setRealTimeData] = useState([]);

   const lastRealTimeData = useRef(null);
   const interval = useRef(null);

   const [realTimeRefreshTime, setRealTimeRefreshTime] = useState(0);

   const formatApiData = (data) => {
      try {
         if (!data || !data.date || !moment(data.date, 'YYYY-MM-DD HH:mm:ss.SSS').isValid()) {
            throw new Error('Données invalides ou date manquante');
         }

         const v1 = parseFloat(data.v1)
         const v2 = parseFloat(data.v2)
         const v3 = parseFloat(data.v3)
         const a1 = parseFloat(data.a1)
         const a2 = parseFloat(data.a2)
         const a3 = parseFloat(data.a3)

         return {
            ...data,
            timestamp: moment.utc(data.date).valueOf(),
            avgCurrent: (a1 + a2 + a3) / 3,
            bv1: v3,
            bv2: v2 - v3,
            bv3: v1 - v2 ,
            v1, a1, v2, a2, v3, a3
         };
      } catch (error) {
         console.error('Erreur dans formatItem:', error, data);
         return null;
      }
   };

   const appendRealTimeData = (apiData) => {
      const newData = (apiData || []).map(formatApiData).filter((item) => item !== null);
      newData.sort((a, b) => a.timestamp - b.timestamp); // old -> new

      if (lastRealTimeData.current && lastRealTimeData.current.timestamp) {
         for (let i = 0; i < newData.length; i++) {
            if (newData[i].timestamp <= lastRealTimeData.current.timestamp) {
               newData.splice(i, 1);
               i--;
            } else {
               break;
            }
         }
      }

      if (newData.length)
         setRealTimeData((prevData) => {
            lastRealTimeData.current = newData[newData.length - 1]
            return [...prevData, ...newData]
         })
   };

   const fetchData = (fromDate = null) => {
      return new Promise((resolve, reject) => {
         console.log('fetchData ', fromDate);
         let url = apiUrl;
         if (fromDate) {
            url += `?from=${encodeURIComponent(moment(fromDate).format('YYYY-MM-DD HH:mm:ss'))}`;
         }
         axios
            .get(url)
            .then((response) => {
               appendRealTimeData(response.data);
               resolve(response.data); // Resolve with the data
            })
            .catch((error) => {
               console.error('Erreur lors du chargement des données API:', error);
               reject(error); // Reject with the error
            });
      });
   };

   const refreshRealTimeData = () => fetchData(lastRealTimeData.current? lastRealTimeData.current.date : null)

   useEffect(() => {
      (async () => {
         try {
            await fetchData();
            setRealTimeRefreshTime(5000); // Set polling interval after initial fetch
         } catch (error) {
            console.error('Erreur initiale dans fetchData:', error);
         }
      })();
   }, []);

   useEffect(() => {
      if (interval.current) {
         clearInterval(interval.current);
         console.log('Intervalle de polling nettoyé');
      }
      if (lastRealTimeData.current && realTimeRefreshTime > 0) {
         interval.current = setInterval(async () => {
            try {
               refreshRealTimeData()
            } catch (error) {
               console.error('Erreur lors du polling:', error);
            }
         }, realTimeRefreshTime);
      }
      return () => {
         if (interval.current) {
            clearInterval(interval.current);
            console.log('Intervalle nettoyé lors du démontage');
         }
      };
   }, [realTimeRefreshTime]);

   return (
      <AppContext.Provider value={{
         lastRealTimeData,
         realTimeData,
         realTimeRefreshTime,
         setRealTimeRefreshTime,
         refreshRealTimeData
      }}>
         {children}
      </AppContext.Provider>
   );
};


export function useApp() {
   return useContext(AppContext);
}