import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { config } from "../App";
import { useSnackbar } from "notistack";
import axios from "axios";
import "./Header.css";

const Header = ({ handleSearch }) => {
  const initialValues = {
    videoURL: "",
    thumbnailURL: "",
    title: "",
    genre: "",
    ageGroup: "",
    publishDate: "",
  };

  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [videoURL, setvideoURL] = useState("");
  const [thumbnailURL, setthumbnailURL] = useState("");
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [formValues, setFormValues] = useState(initialValues);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${config.endpoint}/videos`, {
        videoURL,
        title,
        genre,
        contentRating: ageGroup,
        releaseDate: publishDate,
        previewImage: thumbnailURL,
      });

      if (response.status === 201) {
        enqueueSnackbar("video uploaded successfully", { variant: "success" });
      }
      handleModalClose();
    } catch (error) {
      if (error) {
        enqueueSnackbar(`${error.message}, Something went wrong!`, {
          variant: "error",
        });
      }
    }
  };

  const theme = createTheme({
    overrides: {
      MuiOutlinedInput: {
        root: {
          "& $notchedOutline": {
            borderColor: "white",
          },
          "&$focused $notchedOutline": {
            borderColor: "#1976d2",
          },
        },
      },
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 20px",
        backgroundColor: "#222222",
      }}
    >
      <Typography>
        <span className="x-red">X</span>
        <span className="xflix">Flix</span>
      </Typography>
      <TextField
        id="search-input"
        placeholder="Search"
        className="text-field"
        variant="outlined"
        onChange={handleSearch}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button
        className="btn-upload"
        id="upload-btn"
        onClick={handleModalOpen}
        variant="contained"
        startIcon={<CloudUploadOutlinedIcon />}
      >
        Upload
      </Button>
      <Dialog
        open={open}
        onClose={handleModalClose}
        className="upload-dialog"
        classes={{
          container: {
            backgroundColor: "green",
          },
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <h4>Upload Video</h4>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box
              component="form"
              noValidate
              autoComplete="off"
              className="upload-form-fields"
            >
              <TextField
                id="upload-btn-video"
                label="Video Link"
                variant="outlined"
                helperText="This link will be used to derive the video"
                value={videoURL}
                onChange={(e) => setvideoURL(e.target.value)}
              />

              <TextField
                id="upload-btn-image"
                label="ThumbNail Image Link"
                variant="outlined"
                helperText="This link will be used to preview the thumbnail image"
                value={thumbnailURL}
                onChange={(e) => setthumbnailURL(e.target.value)}
              />
              <TextField
                id="upload-btn-title"
                label="Title"
                variant="outlined"
                helperText="The title will be representative text for video"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                id="upload-btn-genre"
                select
                label="Genre"
                helperText="Genre will help in categorizing your videos"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                <MenuItem value="Education">Education</MenuItem>
                <MenuItem value="Sports">Sports</MenuItem>
                <MenuItem value="Comedy">Comedy</MenuItem>
                <MenuItem value="LifeStyle">LifeStyle</MenuItem>
              </TextField>
              <TextField
                id="upload-btn-content-rating"
                select
                label="Suitable age group for the clip"
                helperText="This will be used to filter videos on age group suitability"
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
              >
                <MenuItem value="Any age group">Any age group</MenuItem>
                <MenuItem value="18+">18+</MenuItem>
                <MenuItem value="16+">16+</MenuItem>
                <MenuItem value="12+">12+</MenuItem>
                <MenuItem value="7+">7+</MenuItem>
              </TextField>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <ThemeProvider theme={theme}>
                  <DesktopDatePicker
                    id="upload-btn-release-date"
                    label="Upload and Publish Date"
                    helperText="This will be used to sort vidoes"
                    variant="outlined"
                    value={publishDate}
                    onChange={(newValue) => setPublishDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </ThemeProvider>
              </LocalizationProvider>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions className="upload-btn-groups">
          <Button
            id="upload-btn-submit"
            variant="contained"
            onClick={handleSubmit}
          >
            Upload Video
          </Button>
          <Button
            id="upload-btn-cancel"
            variant="text"
            onClick={handleModalClose}
            autoFocus
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Header;
