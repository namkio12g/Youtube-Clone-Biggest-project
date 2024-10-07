import axios from "axios";
module.exports.formatData=(data)=>{
    if(data){
        return {data};
    }
    else{
        throw new Error("Data not found!")
    }
}

module.exports.PushlishDataToVideoS=async({data,event_data})=>{
    const payload={
        data:data,
        event:event_data
    }
    axios.post("http:localhost:2000/app-event",{payload})
}



module.exports.PushlishDataToChannelS=async({data,event_data})=> {
    const payload = {
        data: data,
        event: event_data
    }
    axios.post("http:localhost:2000/channel/app-event", {
        payload
    })
}


module.exports.PushlishDataToUserS=async({data,event_data})=>{
    const payload = {
        data: data,
        event: event_data
    }
    axios.post("http:localhost:2000/user/app-event", {
        payload
    })

}