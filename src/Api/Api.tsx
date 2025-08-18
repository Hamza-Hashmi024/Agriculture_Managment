import { Base_Url } from "@/Globle/Base_URL";
import axios from "axios";
import { error } from "console";

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

export const GetBuyerReceivableCard = async (
  buyerId: string
): Promise<Buyer> => {
  try {
    const response = await axios.get(
      `${Base_Url}/api/receivables/getCard/${buyerId}`
    );
    return response.data;
  } catch (error) {
    console.error("Get Buyer Receivable Card API error", error);
    throw error;
  }
};

export const GetAllBuyersWithReceivables = async () => {
  try {
    const response = await axios.get(
      `${Base_Url}/api/buyer/getBuyers/recivable`
    );
    return response.data;
  } catch (error) {
    console.error("Get All Buyers With Receivables API error", error);
    throw error;
  }
};

export const GetBuyerDeatilById = async (id) => {
  try {
    const response = await axios.get(`${Base_Url}/api/buyer/${id}/details`);
    return response.data;
  } catch (error) {
    console.error("Get Buyer Detail By ID API error", error);
  }
};

export const GetAllFarmersFull = async (id) => {
  try {
    const response = await axios.get(`${Base_Url}/api/farmer/full/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get All Farmers API error", error);
    throw error;
  }
};

export const GetAllNetFarmerPayable = async () => {
  try {
    const response = await axios.get(`${Base_Url}/api/farmer/netpayable`);
    return response.data;
  } catch (error) {
    console.error("Get All Net Farmer Payable API error");
    throw error;
  }
};

export const AddPaymentFarmer = async (data) => {
  try {
    const response = await axios.post(
      `${Base_Url}/api/farmer/addpayment`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Add Payment Farmer API error", error);
    throw error;
  }
};

export const GetFarmerPayableSummary = async (id) => {
  try {
    const response = await axios.get(`${Base_Url}/api/farmer/summary/${id}`);
    return response.data;
  } catch (error) {
    console.log(error, "Error get FarmerPayableSummary");
    throw error;
  }
};

export const GetVendorList = async () => {
  try {
    const response = await axios.get(`${Base_Url}/api/vendor/details`);
    return response.data;
  } catch (error) {
    console.log("Api Response Error", error);
    throw error;
  }
};

export const GetVendorProfile = async (id) => {
  try {
    const response = await axios.get(`${Base_Url}/api/vendor/profile/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error Vendor Profile", error);
    throw error;
  }
};

export const AddVendorPayment = async (data) => {
  try {
    const response = axios.post(`${Base_Url}/api/vendor/addpayment`, data);
    return response;
  } catch (error) {
    console.log("Error Add Vendor Payment", error);
    throw error;
  }
};

export const AddExpense = async (data) => {
  try {
    const response = axios.post(
      `${Base_Url}/api/expenses/regiterexpense`,
      data
    );
    return response;
  } catch (error) {
    console.log("Error Add Expense", error);
    throw error;
  }
};

export const GetAllExpenses = async (data) => {
  try {
    const response = await axios.get(`${Base_Url}/api/expenses/`);
    return response.data;
  } catch (err) {
    console.log("Error Get All Expenses", err);
    throw err;
  }
};

export const EditExpense = async (id: string, payload: any) => {
  try {
    const response = await axios.put(
      `${Base_Url}/api/expenses/editexpense/${id}`,
      payload
    );
    return response.data;
  } catch (err) {
    console.error("Error Edit Expense", err);
    throw err;
  }
};

export const GetALLcashboxTransaction = async () => {
  try {
    const response = await axios.get(
      `${Base_Url}/api/accounts/cash/transaction`
    );
    return response.data;
  } catch (err) {
    console.log("Error While Fetching Transaction :-> ", err);
    throw err;
  }
};

export const GetAllBankAccountsTransaction = async () => {
  try {
    const response = await axios.get(
      `${Base_Url}/api/accounts/GetAllBankAccountsTransaction`
    );
    return response.data;
  } catch (error) {
    console.log("Error While Fetching Transaction :-> ", error);
    throw error;
  }
};

export const GetFarmerLedgerReport = async (id) => {
  try {
    const response = await axios.get(`${Base_Url}/api/reports/reports/farmer/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error While Fetching Ledger Report :-> ", error);
    throw error;
  }
};

export const GetBuyersledger = async (id)=>{
  try {
    const response = await axios.get(`${Base_Url}/api/reports/buyer/report/${id}`)
    return response.data;
  }catch(error){
    console.error("Error While Fetching Ledger Report :-> ", error);
    throw error;
  }}


export const RecivableAging = async () =>{
  try {
    const response = await axios.get(`${Base_Url}/api/reports/receivable-aging`)
    console.log(response.data)
    return response.data;
  }
  catch (error){
    console.log(error)
    throw(error)
  }
}