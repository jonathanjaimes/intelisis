import axios from 'axios';

const api = (url) =>{

    return new Promise((resolve, rejected)=>{
        axios.get(url).then((res)=>{
            resolve(res)
        }).catch((err)=>{
            rejected(err)
        })
    })
}

export {api}