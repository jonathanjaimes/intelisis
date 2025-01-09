import React from "react";
import Post from "./Post";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useForm, Controller } from "react-hook-form";
import { api } from "../../API/ApiConfig";

const style = {
  position: "absolute",

  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 400,
  minWidth: "70%",
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
};

const MainView = () => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();
  const [postList, setPostList] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (values) => {
    let idNumber = Math.floor(Math.random() * (10000 - 1000) + 1000);
    let refPostList = postList;
    refPostList.unshift({
      title: values.title,
      body: values.body,
      id: idNumber,
      userId: idNumber,
    });
    handleClose();
  };

  React.useEffect(() => {
    api("https://jsonplaceholder.typicode.com/posts")
      .then((res) => {
        setPostList(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Box sx={{ flexGrow: 1, mb: 4 }}>
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Lista de posts
            </Typography>
            <Button
              onClick={() => {
                handleOpen();
                reset();
              }}
              color="inherit"
            >
              <Box sx={{ mr: 2 }}>Nuevo Post</Box>
              <AddCircleOutlineIcon />
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Container sx={{ pb: 8 }}>
        <Box sx={{ mt: 12 }}>
          {postList.map((post, index) => {
            while (index < 10) {
              return (
                <Post
                  key={post.id}
                  postData={post}
                  allData={postList}
                  setAllData={setPostList}
                />
              );
            }
          })}
        </Box>
      </Container>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Controller
                control={control}
                name="title"
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <TextField
                    id="filled-multiline-flexible"
                    label="Titulo del post"
                    multiline
                    maxRows={4}
                    value={value}
                    onChange={onChange}
                    // defaultValue={props.postData.title}
                  />
                )}
              />
              <Box sx={{ pt: 4 }}>
                <Controller
                  control={control}
                  name="body"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      id="outlined-multiline-static"
                      label="Artículo"
                      multiline
                      rows={6}
                      value={value}
                      onChange={onChange}
                      //   defaultValue={props.postData.body}
                      style={{ width: "100%" }}
                    />
                  )}
                />
              </Box>
              {(errors.title?.type == "required" ||
                errors.body?.type == "required") && (
                <Box sx={{ textAlign: "center", pt: 2, color: "#ff0000" }}>
                  Por favor, llena tsodos los campos antes de guardar
                </Box>
              )}
              <Box textAlign="center" sx={{ pt: 4 }}>
                <Button variant="outlined" type="submit" sx={{ m: 2 }}>
                  Guardar
                </Button>
                <Button
                  onClick={() => {
                    handleClose();
                  }}
                  color="error"
                  variant="outlined"
                  sx={{ m: 2 }}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default MainView;
