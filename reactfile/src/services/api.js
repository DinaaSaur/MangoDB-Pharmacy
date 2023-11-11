import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000", // backend API URL
  timeout: 5000, // Timeout duration
  headers: {
    "Content-Type": "application/json",
  },
});

export const viewMeds = () => API.get("/Patient/viewMed");
export const getMeds = (id) => API.get(`/Patient/getMed/${id}`);
export const addMedicineToCart = (medicineName, quantity) =>
  API.post("/Patient/addMedicineInCart", { medicineName, quantity });
export const removeMedicineFromCart = (medicineName) =>
  API.delete("/Patient/removecart", { medicineName });
export const viewAllOrders = () => API.get("/Patient/viewListOfOrders");
export const viewOrderDetails = (id) =>
  API.get(`/Patient/viewOrderDetails/${id}`);
export const cancelOrder = (id) => API.post(`/Patient/cancelOrder/${id}`);
export const patientReg = (patient) =>
  API.post("/Patient/createPatient", patient);
export const pharmacistReg = (pharmacist) =>
  API.post("/Guest/regPharma", pharmacist);
//export const addMed = (medicine) =>
// API.post("/Pharmacist/addMedicine", medicine);

export const addMed = (medicine) =>
  API.post("/Pharmacist/addMedicine", medicine)
    .then((response) => {
      console.log("API response:", response); // Log the entire response

      if (!response.ok) {
        throw new Error(`Failed to add medicine: ${response.statusText}`);
      }

      return response.json();
    })
    .catch((error) => {
      console.error("Error adding medicine:", error);
      throw error; // Rethrow the error to be caught in the component
    });
export default API;
