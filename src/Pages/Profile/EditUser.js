import {
  Box,
  Button,
  Flex,
  HStack,
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

const EditUser = () => {
  const [user, setUser] = useState([]);
  const [fullAddress, setFullAddress] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [newAdress, setNewAddress] = useState("");
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
        // console.log("Sucesso", res.data);
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
      <Box>
        <Box
          w={{ base: "100%", lg: "350px" }}
          m="0 auto"
          border="1px solid #fff"
          padding="20px"
          borderRadius="8px"
        >
          {isEditing ? (
            <>
              <Text mb="10px" color="white">
                Edição de dados
              </Text>
              <Input
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                mt="10px"
                placeholder="CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />

              <Input
                mt="10px"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Button mt="10px" w="100%" onClick={editUser}>
                Salvar
              </Button>
              <Button mt="10px" w="100%" onClick={(e) => setIsEditing(false)}>
                Cancelar
              </Button>
            </>
          ) : (
            <>
              <Flex display="flex" justifyContent="space-between">
                <Box>
                  <Text fontSize="24px" fontWeight="bold" color="white">
                    {user.name}
                  </Text>
                  <Text fontSize="16px" color="white">
                    CPF: {user.cpf}
                  </Text>
                  <Text fontSize="16px" color="white">
                    Email: {user.email}
                  </Text>
                  {user.hasAddress && (
                    <Text fontSize="16px" color="white">
                      Endereço: {user.address}
                    </Text>
                  )}
                </Box>

                <Box>
                  <IconButton
                    aria-label="Editar"
                    icon={<EditIcon />}
                    onClick={handleEditClick}
                    size="sm"
                    variant="ghost"
                  />
                </Box>
              </Flex>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};
export default EditUser;
