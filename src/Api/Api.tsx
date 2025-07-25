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

export const RegisterVendor = async (data) => {
  try {
    const response = await axios.post(`${Base_Url}/api/vendor/register`, data);
    return response.data;
  } catch (error) {
    console.error("Register Vendor API error:", error);
    throw error;
  }
};

export const RegisterBuyer = async (data) => {
  try {
    const response = await axios.post(`${Base_Url}/api/buyer/register`, data);
    return response.data;
  } catch (error) {
    console.error("Register Buyer API error:", error);
    throw error;
  }
};

export const RecordAccount = async (data) => {
  try {
    const response = await axios.post(`${Base_Url}/api/accounts/create`, data);
    return response.data;
  } catch (error) {
    console.error("Record Account API error:", error);
  }
};

export const CreateTransfer = async (data) => {
  try {
    const response = await axios.post(
      `${Base_Url}/api/accounts/transfer`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Record Tranfer API error:", error);
  }
};

export const GetBankAccountsWithBalance = async () => {
  try {
    const response = await axios.get(
      `${Base_Url}/api/accounts/banks-with-balance`
    );
    return response.data;
  } catch (error) {
    console.error("Get Bank Accounts API error");
  }
};

export const RecordAdvance = async (formData: FormData) => {
  try {
    const response = await axios.post(
      `${Base_Url}/api/advance/create`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Record Advance API error", error);
    throw error;
  }
};

export const GetAllFarmer = async () => {
  try {
    const response = await axios.get(`${Base_Url}/api/farmer/get`);
    return response.data;
  } catch (error) {
    console.error("Get Farmer API error");
  }
};

export const GetAllVendor = async () => {
  try {
    const response = await axios.get(`${Base_Url}/api/vendor/`);
    return response.data;
  } catch (error) {
    console.error("Get Vendor API error");
  }
};

export const GetAllCrops = async () => {
  try {
    const response = await axios.get(`${Base_Url}/api/sales/crops`);
    console.log("Crops data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Get Crops API error");
  }
};

export const GetAllBuyers = async () => {
  try {
    const response = await axios.get(`${Base_Url}/api/buyer/get`);
    return response.data;
  } catch (error) {
    console.error("Get Buyers API error");
  }
};

export const AddSaleLots = async (payload) => {
  try {
    const response = await axios.post(
      `${Base_Url}/api/sales/addSaleLot`,
      payload
    );

    return response.data;
  } catch (error) {
    console.error("Add Sale Lot API error");
  }
};

export const GetAllBuyersBanks = async () => {
  try {
    const response = await axios.get(`${Base_Url}/api/buyer/banks`);
    return response.data;
  } catch (eror) {
    console.error("Get Buyers Banks API error");
  }
};

export const GetAllBuyerReceivables = async () => {
  try {
    const response = await axios.get(`${Base_Url}/api/receivables/get`);
    return response.data;
  } catch (error) {
    console.error("Get Buyer Receivables API error");
  }
};

export const AddPayment = async (data) => {
  try {
    const response = await axios.post(
      `${Base_Url}/api/receivables/addPayment`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Add Payment API error", error);
    throw error;
  }
};

export const GetBuyerById = async (buyerId) => {
  try {
    const response = await axios.get(`${Base_Url}/api/buyer/${buyerId}`);
    return response.data;
  } catch (error) {
    console.error("Get Buyer By ID API error", error);
    throw error;
  }
};

export const GetBuyerInstallments = async (buyerId) => {
  try {
    const response = await axios.get(
      `${Base_Url}/api/buyer/installments/${buyerId}`
    );
    return response.data;
  } catch (error) {
    console.error("Get Buyer Installments API error", error);
    throw error;
  }
};
