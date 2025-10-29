import axios from 'axios';
import moment from 'moment';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';

export const AppContext = createContext();


export const AppProvider = ({ children }) => {

   const [realTimeData, setRealTimeData] = useState([]);
   const [isRealTimeDataLoading, setIsRealTimeDataLoading] = useState(false);


   const [historicData, setHistoricData] = useState([]);


   const lastRealTimeData = useRef(null);
   const timeoutId = useRef(null);

   const [realTimeRefreshTime, setRealTimeRefreshTime] = useState(0);

   const formatRealTimeData = (data) => {
      try {
         if (!data || !data.date || !moment(data.date).isValid()) {
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
            timestamp: moment(data.date).valueOf(),
            avgCurrent: (a1 + a2 + a3) / 3,
            bv1: v3,
            bv2: v2 - v3,
            bv3: v1 - v2,
            v1, a1, v2, a2, v3, a3
         };
      } catch (error) {
         console.error('Erreur dans formatItem:', error, data);
         return null;
      }
   };

   const appendRealTimeData = (apiData) => {
      const newData = (apiData || []).map(formatRealTimeData).filter((item) => item !== null);
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

   const fetchRealTimeData = (fromDate = null) => {
      return new Promise((resolve, reject) => {
         // console.log('fetchData ', fromDate);
         setIsRealTimeDataLoading(true)
         let url = `${process.env.REACT_APP_BASE_URL}/api/data`;
         if (fromDate) {
            url += `?from=${encodeURIComponent(fromDate)}`;
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
            })
            .finally(() => setIsRealTimeDataLoading(false))
      });
   };

   const refreshRealTimeData = async () => {
      return await fetchRealTimeData(lastRealTimeData.current ? lastRealTimeData.current.date : null);
   };

   const formatHistoricData = (data) => {
      try {
         if (!data || !data.date || !moment(data.date).isValid()) {
            throw new Error('Données invalides ou date manquante');
         }

         const v1 = parseFloat(data.avg_v1)
         const v2 = parseFloat(data.avg_v2)
         const v3 = parseFloat(data.avg_v3)
         const a1 = parseFloat(data.avg_a1)
         const a2 = parseFloat(data.avg_a2)
         const a3 = parseFloat(data.avg_a3)

         const w1 = parseFloat(data.ws1)
         const w2 = parseFloat(data.ws2)
         const w3 = parseFloat(data.ws3)

         return {
            ...data,
            timestamp: moment(data.date).valueOf(),
            avgCurrent: (a1 + a2 + a3) / 3,
            bv1: v3,
            bv2: v2 - v3,
            bv3: v1 - v2,
            v1, a1, w1,
            v2, a2, w2,
            v3, a3, w3
         };
      } catch (error) {
         console.error('Erreur dans formatItem:', error, data);
         return null;
      }
   };

   const loadHistoricFile = async (file) => {

      axios.get(file.url, { responseType: 'text' })
         .then((response) => {
            const csvData = response.data;

            Papa.parse(csvData, {
               header: true, // Si le CSV a des en-têtes
               skipEmptyLines: true, // Ignore les lignes vides
               complete: (result) => {
                  // Étape 4 : Traiter les données parsées
                  const parsedData = (result.data || []).map(formatHistoricData); // Tableau d'objets
                  
                  setHistoricData((oldHistoricData) => {
                     const newHistoricData = [...oldHistoricData];
                     parsedData.forEach((newData) => {
                        const existingIndex = newHistoricData.findIndex(
                           (item) => item.timestamp === newData.timestamp
                        );
                        if (existingIndex === -1) {
                           newHistoricData.push(newData);
                        } else {
                           newHistoricData[existingIndex] = {
                              ...newHistoricData[existingIndex],
                              ...newData
                           };
                        }
                     });
                     return newHistoricData.sort((a, b) => a.timestamp - b.timestamp);
                  });
               },
               error: (error) => {
                  console.error('Erreur lors du parsing CSV :', error);
               }
            });
         })
         .catch((error) => {
            console.error('Erreur lors du chargement des données API:', error);
         })
   }

   useEffect(() => {
      if (timeoutId.current) {
         clearTimeout(timeoutId.current);
         // console.log('Intervalle de polling nettoyé');
      }

      const autoRefresh = async () => {
         try {
            await refreshRealTimeData();
            // Planifier le prochain polling seulement si realTimeRefreshTime > 0
            if (realTimeRefreshTime > 0) {
               timeoutId.current = setTimeout(autoRefresh, realTimeRefreshTime);
            }
         } catch (error) {
            console.error('Erreur lors du polling:', error);
         }
      };

      if (realTimeRefreshTime > 0 && lastRealTimeData.current) {
         autoRefresh();
      }

      // Nettoyage lors du démontage ou changement de realTimeRefreshTime
      return () => {
         if (timeoutId.current) {
            clearTimeout(timeoutId.current);
            // console.log('Timeout nettoyé lors du démontage');
         }
      };
   }, [realTimeRefreshTime]);

   return (
      <AppContext.Provider value={{
         historicData,
         isRealTimeDataLoading,
         lastRealTimeData,
         realTimeData,
         realTimeRefreshTime,
         loadHistoricFile,
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