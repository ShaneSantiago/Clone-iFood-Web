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

const EditAddress = (props) => {
  const [newCity, setNewCity] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [fullAddress, setFullAddress] = useState({});
  const [NewNeighbourhood, setNewNeighbourhood] = useState("");
  const [newState, setNewState] = useState("");
  const [newComplement, setNewComplente] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const toast = useToast();

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const handleEditClickAddress = () => {
    setIsEditingAddress(true);
  };

  useEffect(() => {
    address();
  }, []);

  const address = () => {
    const config = {
      headers: { auth: localStorage.getItem("token") },
    };
    axios
      .get(`${BASE_URL}/profile/address`, config)
      .then((res) => {
        // console.log("Sucesso Address", res.data);
        setFullAddress(res.data.address);
      })
      .catch((erro) => {
        console.log("Erro address", erro.response.data);
      });
  };

  const editAddressProfile = () => {
    const config = {
      headers: { auth: localStorage.getItem("token") },
    };
    const body = {
      street: newStreet,
      number: newNumber,
      neighbourhood: NewNeighbourhood,
      city: newCity,
      state: newState,
      complement: newComplement,
    };

    axios
      .put(`${BASE_URL}/address`, body, config)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        toast({
          title: "Pronto",
          description: "Seu endereço foi alterado com sucesso",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setIsEditingAddress(false);
      })
      .catch((erro) => {
        toast({
          title: "Ops",
          description: erro.response.data.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  return (
    <>
      <Box
        w={{ base: "100%", lg: "350px" }}
        m="10px auto"
        border="1px solid #fff"
        padding="20px"
        borderRadius="8px"
      >
        {isEditingAddress ? (
          <>
            <Text mb="10px" color="white">
              Edição de Endereço
            </Text>
            <Input
              placeholder="Cidade"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
            />

            <Input
              mt="10px"
              placeholder="Bairro"
              value={NewNeighbourhood}
              onChange={(e) => setNewNeighbourhood(e.target.value)}
            />

            <Input
              mt="10px"
              placeholder="Estado"
              value={newState}
              onChange={(e) => setNewState(e.target.value)}
            />

            <Input
              mt="10px"
              placeholder="Rua"
              value={newStreet}
              onChange={(e) => setNewStreet(e.target.value)}
            />

            <Input
              mt="10px"
              placeholder="Número"
              value={newNumber}
              onChange={(e) => setNewNumber(e.target.value)}
            />

            <Button mt="10px" w="100%" onClick={editAddressProfile}>
              Salvar
            </Button>
            <Button
              mt="10px"
              w="100%"
              onClick={(e) => setIsEditingAddress(false)}
            >
              Cancelar
            </Button>
          </>
        ) : (
          <>
            <Flex display="flex" justifyContent="space-between">
              <Box>
                <Text fontSize="24px" fontWeight="bold" color="white">
                  Endereço Completo
                </Text>
                <Text fontSize="16px" color="white">
                  Cidade: {fullAddress.city}
                </Text>

                <Text fontSize="16px" color="white">
                  Bairro: {fullAddress.neighbourhood}
                </Text>

                <Text fontSize="16px" color="white">
                  Estado: {fullAddress.state}
                </Text>

                <Text fontSize="16px" color="white">
                  Rua: {fullAddress.street}
                </Text>

                <Text fontSize="16px" color="white">
                  Número: {fullAddress.number}
                </Text>
              </Box>
              <Box>
                <IconButton
                  aria-label="Editar"
                  icon={<EditIcon />}
                  onClick={handleEditClickAddress}
                  size="sm"
                  variant="ghost"
                />
              </Box>
            </Flex>
          </>
        )}
      </Box>
    </>
  );
};
export default EditAddress;
