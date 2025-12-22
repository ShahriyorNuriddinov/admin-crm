import api from "./api";

const PaymentService = {
  async getDebtorsStudent({ month } = {}) {
    const params = {};
    if (month) params.month = month;

    const { data } = await api.get("/api/payment/get-debtors-student", {
      params,
    });
    return data;
  },
};

export default PaymentService;