// import NetInfo from "@react-native-community/netinfo";
// import { getItem, setItem } from "./storage";

// const offlineHandler = async (onConnected, apiObj) => {
//   return new Promise((resolve, reject) => {
//     NetInfo.fetch().then(async (state) => {
//       let prevApis = []
//       if (state.isConnected) {
//         resolve(onConnected())
//       } else {
//         let apis = await getItem('offlineAPIs')
//         if (apis && apis.length) {
//           apis.push(apiObj)
//           await setItem('offlineAPIs', apis)
//         } else {
//           prevApis.push(apiObj)
//           await setItem('offlineAPIs', prevApis)
//         }
        
//         resolve()
//       }
//     })
//   })
// }

// export default offlineHandler