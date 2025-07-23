import axios from "axios"
import toast from "react-hot-toast";
export async function handlelogout(nav){
    const url = "http://localhost:5001/api/logout";
    axios.post(url,{},{withCredentials:true})
         .then(()=>{
            toast.success("Logged out successfully");
            nav("/login");
         })
         .catch((error)=>{
            toast.error("Error while logging out");
            console.log(`Erorr : ${error}`);
            
         })
    

}