import { Base_Url } from "@/Globle/Base_URL";
import axios from "axios";


export const RegisterFarmer = async (data) => {
  try {
    const response = await axios.post(`${Base_Url}/api/farmer/register`, data);
    return response.data;
  } catch (error) {
    console.error("RegisterFarmer API error:", error);
    throw error;
  }
};

export const  RegisterVendor = async (data) => {
  try {
    const response = await axios.post(`${Base_Url}/api/vendor/register`, data);
    return response.data;
  }catch (error){
    console.error("Register Vendor API error:", error);
    throw error;
  }
}


export const RegisterBuyer = async (data) => {
  try {
    const response = await axios.post(`${Base_Url}/api/buyer/register`, data);
    return response.data;
  } catch (error) {
    console.error("Register Buyer API error:", error);
    throw error;
  }
};


export const RecordAccount = async (data)=>{
  try {
    const response = await axios.post(`${Base_Url}/api/accounts/create` , data );
    return response.data;
  }catch(error){
    console.error("Record Account API error:", error);
  }
}


export const CreateTransfer = async (data)=> {
  try {
    const response = await axios.post(`${Base_Url}/api/accounts/transfer` , data );
    return response.data;
  }catch(error){
    console.error("Record Tranfer API error:", error);
  }
}

export const GetBankAccountsWithBalance = async()=>{
  try{
    const response = await axios.get(`${Base_Url}/api/accounts/banks-with-balance`);
    return response.data;
  }catch(error){
    console.error("Get Bank Accounts API error");
  }
}