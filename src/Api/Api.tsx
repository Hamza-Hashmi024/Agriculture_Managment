import { Base_Url } from "@/Globle/Base_URL";
import api from "./http"; 

export const RegisterFarmer = async (data) => {
  try {
    const response = await api.post(`${Base_Url}/api/farmer/register`, data);
    return response.data;
  } catch (error) {
    console.error("RegisterFarmer API error:", error);
    throw error;
  }
};

export const RegisterVendor = async (data) => {
  try {
    const response = await api.post(`${Base_Url}/api/vendor/register`, data);
    return response.data;
  } catch (error) {
    console.error("Register Vendor API error:", error);
    throw error;
  }
};

export const RegisterBuyer = async (data) => {
  try {
    const response = await api.post(`${Base_Url}/api/buyer/register`, data);
    return response.data;
  } catch (error) {
    console.error("Register Buyer API error:", error);
    throw error;
  }
};

export const RecordAccount = async (data) => {
  try {
    const response = await api.post(`${Base_Url}/api/accounts/create`, data);
    return response.data;
  } catch (error) {
    console.error("Record Account API error:", error);
  }
};

export const CreateTransfer = async (data) => {
  try {
    const response = await api.post(
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
    const response = await api.get(
      `${Base_Url}/api/accounts/banks-with-balance`
    );
    return response.data;
  } catch (error) {
    console.error("Get Bank Accounts API error");
  }
};

export const RecordAdvance = async (formData: FormData) => {
  try {
    const response = await api.post(
      `${Base_Url}/api/advance/create`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return { success: true, ...response.data };
  } catch (error: any) {
    console.error("Record Advance API error", error);

    return {
      success: false,
      message:
        error.response?.data?.message || "Network error while creating advance",
    };
  }
};

export const GetAllFarmer = async () => {
  try {
    const response = await api.get(`${Base_Url}/api/farmer/get`);
    return response.data;
  } catch (error) {
    console.error("Get Farmer API error");
  }
};

export const GetAllVendor = async () => {
  try {
    const response = await api.get(`${Base_Url}/api/vendor/`);
    return response.data;
  } catch (error) {
    console.error("Get Vendor API error");
  }
};

export const GetAllCrops = async () => {
  try {
    const response = await api.get(`${Base_Url}/api/sales/crops`);
    console.log("Crops data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Get Crops API error");
  }
};

export const GetAllBuyers = async () => {
  try {
    const response = await api.get(`${Base_Url}/api/buyer/get`);
    return response.data;
  } catch (error) {
    console.error("Get Buyers API error");
  }
};

export const AddSaleLots = async (payload) => {
  try {
    const response = await api.post(
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
    const response = await api.get(`${Base_Url}/api/buyer/banks`);
    return response.data;
  } catch (eror) {
    console.error("Get Buyers Banks API error");
  }
};

export const GetAllBuyerReceivables = async () => {
  try {
    const response = await api.get(`${Base_Url}/api/receivables/get`);
    return response.data;
  } catch (error) {
    console.error("Get Buyer Receivables API error");
  }
};

export const AddPayment = async (data) => {
  try {
    const response = await api.post(
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
    const response = await api.get(`${Base_Url}/api/buyer/${buyerId}`);
    return response.data;
  } catch (error) {
    console.error("Get Buyer By ID API error", error);
    throw error;
  }
};

export const GetBuyerInstallments = async (buyerId) => {
  try {
    const response = await api.get(
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
    const response = await api.get(
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
    const response = await api.get(
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
    const response = await api.get(`${Base_Url}/api/buyer/${id}/details`);
    return response.data;
  } catch (error) {
    console.error("Get Buyer Detail By ID API error", error);
  }
};

export const GetAllFarmersFull = async (id) => {
  try {
    const response = await api.get(`${Base_Url}/api/farmer/full/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get All Farmers API error", error);
    throw error;
  }
};

export const GetAllNetFarmerPayable = async () => {
  try {
    const response = await api.get(`${Base_Url}/api/farmer/netpayable`);
    return response.data;
  } catch (error) {
    console.error("Get All Net Farmer Payable API error");
    throw error;
  }
};

export const AddPaymentFarmer = async (data) => {
  try {
    const response = await api.post(
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
    const response = await api.get(`${Base_Url}/api/farmer/summary/${id}`);
    return response.data;
  } catch (error) {
    console.log(error, "Error get FarmerPayableSummary");
    throw error;
  }
};

export const GetVendorList = async () => {
  try {
    const response = await api.get(`${Base_Url}/api/vendor/details`);
    return response.data;
  } catch (error) {
    console.log("Api Response Error", error);
    throw error;
  }
};

export const GetVendorProfile = async (id) => {
  try {
    const response = await api.get(`${Base_Url}/api/vendor/profile/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error Vendor Profile", error);
    throw error;
  }
};

export const AddVendorPayment = async (data) => {
  try {
    const response = api.post(`${Base_Url}/api/vendor/addpayment`, data);
    return response;
  } catch (error) {
    console.log("Error Add Vendor Payment", error);
    throw error;
  }
};

export const AddExpense = async (data) => {
  try {
    const response = api.post(
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
    const response = await api.get(`${Base_Url}/api/expenses/`);
    return response.data;
  } catch (err) {
    console.log("Error Get All Expenses", err);
    throw err;
  }
};

export const EditExpense = async (id: string, payload: any) => {
  try {
    const response = await api.put(
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
    const response = await api.get(
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
    const response = await api.get(
      `${Base_Url}/api/accounts/GetAllBankAccountsTransaction`
    );
    return response.data;
  } catch (error) {
    console.log("Error While Fetching Transaction :-> ", error);
    throw error;
  }
};

export const GetFarmerLedgerReport = async (
  id: string,
  from?: string,
  to?: string
) => {
  try {
    // Build query string only if from/to exist
    const query = from && to ? `?from=${from}&to=${to}` : "";
    const response = await api.get(
      `${Base_Url}/api/reports/reports/farmer/${id}${query}`
    );
    return response.data;
  } catch (error) {
    console.error("Error While Fetching Ledger Report :-> ", error);
    throw error;
  }
};

export const GetBuyersledger = async (id: string, from: string, to: string) => {
  try {
    const url = `${Base_Url}/api/reports/buyer/report/${encodeURIComponent(id)}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
    const response = await api.get(url);
    return response.data; // array of transactions
  } catch (error) {
    console.error("Error While Fetching Ledger Report :-> ", error);
    throw error;
  }
};

export const RecivableAging = async () => {
  try {
    const response = await api.get(
      `${Base_Url}/api/reports/receivable-aging`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const PayAbleAging = async () => {
  try {
    const response = await api.get(`${Base_Url}/api/reports/payable-aging`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const GetCashbook = async (from: string, to: string) => {
  try {
    const response = await api.get(`${Base_Url}/api/reports/cashbook`, {
      params: { from, to },
    });
    console.log("Cashbook Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching cashbook:", error);
    throw error;
  }
};

export const GetBankBooks = async (from: string, to: string) => {
  try {
    const response = await api.get(`${Base_Url}/api/reports/bankbook`, {
      params: { from, to },
    });
    console.log("Bankbook Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching bankbook:", error);
    throw error;
  }
};

export const GetSalesReport = async (startDate: string, endDate: string) => {
  try {
    const response = await api.get(`${Base_Url}/api/reports/salesReport`, {
      params: { startDate, endDate },
    });
    console.log("Sales Report Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching sales report:", error);
    throw error;
  }
};

export const GetDashboredData = async () => {
  try {
    const response = await api.get(`${Base_Url}/api/v1/dashboard`); 
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const GetAdvanceList = async () => {
  try {
    const response = await api.get(`${Base_Url}/api/advance/`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const GetSalesList = async () => {
  try {
    const response = await api.get(`${Base_Url}/api/sales/list`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const GetAccountSummary = async () => {
  try {
    const response = await api.get(`${Base_Url}/api/accounts/summary`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const GetAllCheques = async () => {
  try {
    const response = await api.get(`${Base_Url}/api/checklist/cheques`);
    return response.data;
  } catch (error) {
    console.log("Error While Fetching Cheques :-> ", error);
    throw error;
  }
};

export const UpdateChequeStatus = async (chequeId: number, status: string) => {
  try {
    const response = await api.put(
      `${Base_Url}/api/checklist/cheques/status`,
      { chequeId, status }
    );
    return response.data;
  } catch (error) {
    console.log("Error While Updating Cheque Status :-> ", error);
    throw error;
  }
};

// 1. Get today's pending buyers (receivables summary)
export const GetReceivablesDueToday = async (
  date?: string,
  includePartial: boolean = true
) => {
  try {
    const response = await api.get(`${Base_Url}/api/receivables/due-today`, {
      params: { date, includePartial },
    });
    return response.data;
  } catch (error) {
    console.log("Error While Fetching Today's Receivables :-> ", error);
    throw error;
  }
};

export const GetReceivablesByBuyer = async (buyerId: number, date?: string) => {
  try {
    const response = await api.get(
      `${Base_Url}/api/receivables/due-today/${buyerId}`,
      {
        params: { date },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error While Fetching Receivables By Buyer :-> ", error);
    throw error;
  }
};

//  3. Extend installment due date
export const ExtendInstallmentDueDate = async (
  installmentId: number,
  newDueDate: string,
  userId?: number
) => {
  try {
    const response = await api.post(
      `${Base_Url}/api/receivables/extend-due-date/${installmentId}`,
      {
        newDueDate,
        userId,
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error While Extending Installment Due Date :-> ", error);
    throw error;
  }
};

export const FetchTheme = async (userId: number) => {
  const res = await api.get(`${Base_Url}/api/theme/${userId}`);
  return res.data;
};

// Save Theme (PUT)
export const SaveTheme = async (
  userId: number,
  theme: { primary: string; background: string; foreground: string }
) => {
  // Map frontend keys → backend keys
  const payload = {
    primaryColor: theme.primary,
    backgroundColor: theme.background,
    foregroundColor: theme.foreground,
  };

  const res = await api.put(`${Base_Url}/api/theme/${userId}`, payload);
  return res.data;
};

export const Login = async (email: string, password: string) => {
  try {
    const response = await api.post(`${Base_Url}/api/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.log("Error While Logging In :-> ", error);
    throw error;
  }
}

export const GetProfile = async () => {
  try {
    const response = await api.get(`${Base_Url}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error While Fetching User Profile :-> ", error);
    throw error;
  }
};

export const RefreshToken = async (refreshToken: string) => {
  try {
    const response = await api.post(`${Base_Url}/api/auth/refresh`, {
      refreshToken,
    });
    return response.data;
  } catch (error) {
    console.log("Error While Refreshing Token :-> ", error);
    throw error;
  }
};

export const Logout = async (refreshToken: string) => {
  try {
    const response = await api.post(`${Base_Url}/api/auth/logout`, {
      refreshToken,
    });
    return response.data;
  } catch (error) {
    console.log("Error While Logging Out :-> ", error);
    throw error;
  }
};

export const LogoutAll = async (userId: number) => {
  try {
    const response = await api.post(`${Base_Url}/api/auth/logout_all`, {
      userId,
    });
    return response.data;
  } catch (error) {
    console.log("Error While Logging Out All :-> ", error);
    throw error;
  }
};
 
export const ForgotPassword = async (email: string) => {
  try {
    const response = await api.post(`${Base_Url}/api/auth/forgot`, {
      email,
    });
    return response.data;
  } catch (error) {
    console.log("Error While Requesting Password Reset :-> ", error);
    throw error;
  }
};


export const ResetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await api.post(`${Base_Url}/api/auth/reset`, {
      token,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.log("Error While Resetting Password :-> ", error);
    throw error;
  }
};


export const GetAllUsers = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await api.get(`${Base_Url}/api/users/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.log("Error While Fetching All Users :-> ", error);
    throw error.response?.data || error;
  }
};


export const AssignRoleToUser = async (userId: number, roleId: number) => {
  try {
    const response = await api.post("/users/assign-role", { userId, roleId });
    return response.data;
  } catch (error: any) {
    console.error("Assign role error:", error);
    throw error.response?.data || error;
  }
};


export const CreateUser = async (data) => {
    try {
      const response =  await api.post(`/users/`, data);
      return response.data;
    } catch (error: any) {
      console.log("Error While Creating User :-> ", error);
      throw error.response?.data || error;
    }
};


export const GetAllRoles = async () => {
  try {
    const response = await api.get(`/users/roles`);
    return response.data;
  } catch (error: any) {
    console.log("Error While Fetching Roles :-> ", error);
    throw error.response?.data || error;
  }
};


