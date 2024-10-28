import { useState } from "react";

export function useAsync(func,dependencies,initialLoading=false){

}
export function useAsyncFn (func, dependencies, initialLoading = false) {

}
function internalAsyncFunc(func,dependencies,initialLoading){
    const [loading,setLoading]=useState(initialLoading);
    const [error,setErorr]=useState(null);
    const [value,setValue]=useState([])
}