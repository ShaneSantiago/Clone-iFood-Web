import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../Constants/url";
import { EditIcon } from "@chakra-ui/icons";
import EditAddress from "./EditAddress";
import EditUser from "./EditUser";
import OrderHistory from "./OrderHistory";
import UseProtectedPage from "../../Components/Hooks/useProtectedPage";

const Profile = () => {
  UseProtectedPage();
  const [user, setUser] = useState([]);
  const [fullAddress, setFullAddress] = useState([]);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [cpf, setCpf] = useState(user.cpf);
  const [newAdress, setNewAddress] = useState(user.address);
  const [isEditing, setIsEditing] = useState(false);

  const toast = useToast();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    profile();
    address();
  }, []);

  const profile = () => {
    const config = {
      headers: { auth: localStorage.getItem("token") },
    };
    axios
      .get(`${BASE_URL}/profile`, config)
      .then((res) => {
        console.log("Sucesso", res.data);
        setUser(res.data.user);
      })
      .catch((erro) => {
        console.log("Erro", erro.response.data);
      });
  };

  const editUser = () => {
    const body = {
      name: name,
      email: email,
      cpf: cpf,
      address: newAdress,
    };

    const config = {
      headers: { auth: localStorage.getItem("token") },
    };
    axios
      .put(`${BASE_URL}/profile`, body, config)
      .then((res) => {
        toast({
          title: "Pronto",
          description: "Seu dados foram editados com sucesso",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setIsEditing(false);
      })
      .catch((erro) => {
        console.log("Erro edit", erro.response.data);
      });
  };

  const address = () => {
    const config = {
      headers: { auth: localStorage.getItem("token") },
    };
    axios
      .get(`${BASE_URL}/profile/address`, config)
      .then((res) => {
        setFullAddress(res.data.address);
      })
      .catch((erro) => {
        console.log("Erro address", erro.response.data);
      });
  };

  return (
    <>
      <Box
        background="linear-gradient(to right, red, #ff8c00)"
        minHeight="100vh"
      >
        <Box
          padding="20px"
          background="linear-gradient(to right, red, #ff8c00)"
        >
          <Flex
            w={{ base: "100%", lg: "70%" }}
            m="0 auto"
            flexDirection="column"
            marginTop="70px"
          >
            <Text
              fontWeight="500"
              fontSize="50px"
              textAlign="center"
              color="white"
            >
              Perfil do usuário
              <span style={{ color: "#5CB646" }}> Future Eats</span>
            </Text>
          </Flex>
        </Box>

        <Flex
          display="flex"
          justifyContent="space-around"
          flexDirection={{ base: "column", lg: "row" }}
        >
          <Box>
            <Text m="10px" color="white" fontWeight="bold">
              Detalhes do Perfil
            </Text>
            <EditUser />
            <EditAddress />
          </Box>
        </Flex>

        <Box display="flex" flexDirection="column" alignItems="center">
          <Text m="10px" color="white" fontWeight="bold">
            Detalhes dos pedidos realizados
          </Text>
          <OrderHistory />
        </Box>
      </Box>
    </>
  );
};
export default Profile;
