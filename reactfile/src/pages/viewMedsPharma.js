import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  viewMeds,
  getAllMedicineUses,
  getMedicinesByUse,
  addMed as addMedicineApi,
} from "../services/api";
import { pharmacistListItems } from "../components/ListItemsPharma";
const prescribedOptions = ["required", "not required"];

const ViewMedsPharma = () => {
  const [meds, setMeds] = useState([]);
  const [medicineUses, setMedicineUses] = useState([]);
  const [selectedUse, setSelectedUse] = useState("");
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [addMedicine, setAddMedicine] = useState({
    name: "",
    price: "",
    use: "",
    description: "",
    quantity: "",
    sales: "",
    details: "",
    prescribed :"",
  });

  const [isAddMedPending, setIsAddMedPending] = useState(false);
  const [addMedSuccessOpen, setAddMedSuccessOpen] = useState(false);
  const [addMedErrorOpen, setAddMedErrorOpen] = useState(false);

  const [addMedicineOpen, setAddMedicineOpen] = useState(false);

  const handleAddMedicineOpen = () => {
    setAddMedicineOpen(true);
  };

  const handleAddMedicineClose = () => {
    setAddMedicineOpen(false);
  };

  useEffect(() => {
    // Fetch medicine uses when the component mounts
    getAllMedicineUses()
      .then((response) => {
        setMedicineUses(response.data);
      })
      .catch((err) => {
        console.error(err.message);
      });

    // Fetch medicine data
    viewMeds()
      .then((response) => {
        setMeds(response.data);
        setIsPending(false);
        setError(null);
      })
      .catch((err) => {
        setIsPending(false);
        setError(err.message);
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleUseChange = (e) => {
    setSelectedUse(e.target.value);

    // Fetch medicines for the selected use
    if (e.target.value) {
      getMedicinesByUse(e.target.value)
        .then((response) => {
          setMeds(response.data.medicines);
        })
        .catch((err) => {
          setError(err.message);
        });
    } else {
      // If no use selected, fetch all medicines
      viewMeds()
        .then((response) => {
          setMeds(response.data);
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddMedicine((prevMedicine) => ({
      ...prevMedicine,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAddMedPending(true);
  
    try {
      const newMedicine = { ...addMedicine }; // Create a new object for the new medicine
      await addMedicineApi(newMedicine);
      setIsAddMedPending(false);
      setAddMedSuccessOpen(true);
  
      // Directly add the new medicine to the state
      setMeds((prevMeds) => [...prevMeds, newMedicine]);
  
      // Reset the form
      setAddMedicine({
        name: "",
        price: "",
        use: "",
        description: "",
        quantity: "",
        sales: "",
        details: "",
      });
    } catch (error) {
      console.error("Error adding medicine:", error);
      setIsAddMedPending(false);
      setAddMedErrorOpen(true);
    }
  };

  const handleSuccessClose = () => {
    setAddMedSuccessOpen(false);
    // Redirect to home after success if needed
    viewMeds().then((response) => {
      setMeds(response.data);
    });
  };

  const handleErrorClose = () => {
    setAddMedErrorOpen(false);
  };

  return (
    <Grid container>
      {/* Sidebar */}
      <Grid
        item
        xs={12}
        sm={3}
        md={2}
        lg={2}
        xl={2}
        style={{ background: "#f0f0f0", minHeight: "100vh", paddingTop: "2rem" }}
      >
        {pharmacistListItems}
      </Grid>

      {/* Main Content */}
      <Grid item xs={12} sm={9} md={10} lg={10} xl={10} style={{ paddingLeft: "2rem" }}>
        <Typography variant="h4" gutterBottom>
          Medicines
        </Typography>

        {/* Display Medicine Uses */}
        <FormControl fullWidth margin="normal" sx={{ minWidth: 200 }}>
          <InputLabel id="medicineUseLabel">Select Medicine Use</InputLabel>
          <Select
            labelId="medicineUseLabel"
            id="medicineUse"
            value={selectedUse}
            onChange={handleUseChange}
          >
            <MenuItem value="">All Uses</MenuItem>
            {medicineUses.map((use, index) => (
              <MenuItem key={index} value={use}>
                {use}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Search Bar */}
        <TextField
          label="Search for Medicine Name"
          variant="outlined"
          fullWidth
          size="small"
          margin="normal"
          onChange={handleSearchChange}
          value={searchTerm}
          InputProps={{
            startAdornment: <InputAdornment position="start"></InputAdornment>,
          }}
          sx={{ borderRadius: "20px" }}
        />

        {/* Display Medicines */}
        {isPending && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {meds && (
          <div>
            {meds
              .filter((med) => med.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((med) => (
                <Link
                  to={`/medicinePharma/${med._id}`}
                  key={med._id}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Paper
                    style={{
                      padding: "1rem",
                      marginBottom: "1rem",
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    {med.picture && (
                      <img
                        src={`http://localhost:4000/${med.picture}`}
                        alt={med.name}
                        style={{ width: "50px", height: "50px", marginRight: "1rem" }}
                      />
                    )}
                    <div>
                      <Typography variant="h6">{med.name}</Typography>
                      <Typography>{med.description}</Typography>
                      <Typography variant="subtitle1">Price: {med.price}</Typography>
                    </div>
                  </Paper>
                </Link>
              ))}
          </div>
        )}

        {/* Add Medicine Button */}
        <Button variant="contained" color="primary" onClick={handleAddMedicineOpen}>
          Add Medicine
        </Button>

        {/* Add Medicine Dialog */}
        <Dialog open={addMedicineOpen} onClose={handleAddMedicineClose}>
          <DialogTitle>{"Add Medicine"}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    name="name"
                    value={addMedicine.name}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Price"
                    name="price"
                    value={addMedicine.price}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Use"
                    name="use"
                    value={addMedicine.use}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Description"
                    name="description"
                    value={addMedicine.description}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="prescribed-label">Prescribed</InputLabel>
                  <Select
                    labelId="prescribed-label"
                    id="prescribed"
                    name="prescribed"
                    value={addMedicine.prescribed}
                    onChange={handleChange}
                    fullWidth
                    required
                  >
                    {prescribedOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Quantity"
                    name="quantity"
                    value={addMedicine.quantity}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Sales"
                    name="sales"
                    value={addMedicine.sales}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Details"
                    name="details"
                    value={addMedicine.details}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                style={{ marginTop: "2rem" }}
              >
                {isAddMedPending ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Add"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add Medicine Success Dialog */}
        <Dialog open={addMedSuccessOpen} onClose={handleSuccessClose}>
          <DialogTitle>{"Medicine Added Successfully"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Medicine was successfully added. You will be redirected to the home
              page shortly.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSuccessClose} autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Medicine Error Dialog */}
        <Dialog open={addMedErrorOpen} onClose={handleErrorClose}>
          <DialogTitle>{"Probably worked"}</DialogTitle>
          <DialogContent>
            <DialogContentText>Check db for a surprise 😉</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleErrorClose} autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Grid>
  );
};

export default ViewMedsPharma;
