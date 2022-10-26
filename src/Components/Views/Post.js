import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Container from "@mui/material/Container";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import TextField from "@mui/material/TextField";
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

const Post = (props) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const refColumns = React.useRef([
    {
      field: "name",
      headerName: "Usuario",
      minWidth: 150,
      maxWidth: 250,
      sortable: false,
    },
    {
      field: "body",
      headerName: "Opinión",
      minWidth: 300,
      maxWidth: 500,
      sortable: false,
    },
    {
      field: "Acción",
      width: 250,
      sortable: false,
      renderCell: (cellValues) => (
        <Button
          variant="outlined"
          //   style={{ cursor: "pointer" }}
          onClick={() => {
            setInfoComment({
              name: cellValues.row.name,
              email: cellValues.row.email,
              body: cellValues.row.body,
            });
            handleOpen();
          }}
        >
          Ver más
        </Button>
      ),
    },
  ]);
  const [rows, setRows] = React.useState([]);
  const [isShowComments, setIsShowComments] = React.useState(false);
  const [infoComment, setInfoComment] = React.useState({
    name: "",
    body: "",
    email: "",
  });
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setAction("nothing");
    setOpen(false);
  };
  const [action, setAction] = React.useState("nothing");

  const onSubmit = (values) => {
    let dataIndex = props.allData.findIndex(
      (post) => post.id == props.postData.id
    );
    props.allData[dataIndex].title = values.title;
    props.allData[dataIndex].body = values.body;

    handleClose();
  };

  //Función que permite usar un solo modal con dos tres diferentes vistas.
  const viewModal = () => {
    switch (action) {
      case "nothing":
        return (
          <>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              <span style={{ fontWeight: 600 }}>Autor: </span>
              {infoComment.name}
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              <span style={{ fontWeight: 600 }}>Correo: </span>
              {infoComment.email}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {infoComment.body}
            </Typography>
            <Box textAlign="center" sx={{ mt: 4 }}>
              <Button variant="outlined" onClick={() => handleClose()}>
                Cerrar
              </Button>
            </Box>
          </>
        );
      case "editing":
        return (
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
                  Por favor, llena todos los campos antes de guardar
                </Box>
              )}
              <Box textAlign="center" sx={{ pt: 4 }}>
                <Button variant="outlined" type="submit" sx={{ m: 2 }}>
                  Guardar
                </Button>
                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => {
                    handleClose();
                  }}
                  sx={{ m: 2 }}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          </form>
        );
      case "removing":
        return (
          <>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              ¿Estás seguro que quieres eliminar este post?
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Box textAlign="center" sx={{ m: 1 }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    removePost();
                    handleClose();
                  }}
                >
                  Eliminar
                </Button>
              </Box>
              <Box textAlign="center" sx={{ m: 1 }}>
                <Button variant="outlined" onClick={() => handleClose()}>
                  Cancelar
                </Button>
              </Box>
            </Box>
          </>
        );
      default:
        return <p>default case</p>;
    }
  };

  const removePost = () => {
    props.setAllData(
      props.allData.filter((post) => post.id != props.postData.id)
    );
  };

  //Función que permite establecer un mensaje por defecto en caso de que no hayan comentarios
  function CustomNoRowsOverlay() {
    return (
      <Box textAlign="center" sx={{ mt: 8 }}>
        Aún no hay comentarios...
      </Box>
    );
  }

  React.useEffect(() => {
    api(
      `https://jsonplaceholder.typicode.com/posts/${props.postData.id}/comments`
    )
      .then((res) => {
        setRows(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#fff",
          my: 2,
          borderRadius: "5px",
          pb: 2,
          boxShadow: "0px 0px 8px 0px rgba(0,0,0,0.1)",
        }}
      >
        <Box sx={{ padding: 2, width: "90%" }}>
          <Typography variant="h5" sx={{ my: 2 }}>
            {props.postData.title}
          </Typography>
          <Box sx={{ textAlign: "center", pb: 4 }}>
            <Button
              sx={{ mx: 1 }}
              variant="outlined"
              onClick={() => {
                setAction("editing");
                reset({
                  title: props.postData.title,
                  body: props.postData.body,
                });
                handleOpen();
              }}
            >
              <BorderColorIcon fontSize="10" />
            </Button>
            <Button
              sx={{ mx: 1 }}
              variant="outlined"
              onClick={() => {
                setAction("removing");
                handleOpen();
              }}
            >
              <DeleteForeverIcon fontSize="10" />
            </Button>
          </Box>
          <Typography variant="h6" sx={{ mb: 4, fontSize: "15px" }}>
            {props.postData.body}
          </Typography>
          <Box textAlign="center" sx={{ mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setIsShowComments(!isShowComments);
              }}
            >
              {isShowComments ? (
                <span>Ocultar comentarios</span>
              ) : (
                <span>Mostrar comentarios</span>
              )}
            </Button>
          </Box>
        </Box>

        {isShowComments && (
          <Box sx={{ height: 285, width: "90%" }}>
            <DataGrid
              components={{
                NoRowsOverlay: CustomNoRowsOverlay,
              }}
              rows={rows}
              columns={refColumns.current}
              pageSize={3}
              rowsPerPageOptions={[3]}
              disableColumnFilter
              disableColumnMenu
              disableColumnSelector
              disableSelectionOnClick
              disableDensitySelector
            />
          </Box>
        )}
      </Container>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>{viewModal()}</Box>
      </Modal>
    </>
  );
};

export default Post;
