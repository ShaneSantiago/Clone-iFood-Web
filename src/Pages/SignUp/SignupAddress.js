import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../../Constants/url";
import future from "../../assets/future.png";
import { useNavigate } from "react-router-dom";
import UnProtectedPage from "../../Components/Hooks/useUnprotectedPage";

const SignUpAddress = () => {
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighbourhood, setNeighbourhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [complement, setComplement] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const toast = useToast();

  const onSubmit = (e) => {
    e.preventDefault();

    if (!street || !number || !neighbourhood || !city || !state) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    signupAddress();
  };

  const signupAddress = () => {
    setLoading(true);
    const body = {
      street: street,
      number: number,
      neighbourhood: neighbourhood,
      city: city,
      state: state,
      complement: complement,
    };
    const config = {
      headers: { auth: localStorage.getItem("token") },
    };
    axios
      .put(`${BASE_URL}/address`, body, config)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        toast({
          title: "Sucesso",
          description: "Endereço cadastrado com sucesso",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setLoading(false);
        navigate("/feed");
      })
      .catch((erro) => {
        console.log("Erro", erro.response.data);
        setLoading(true);
        toast({
          title: "Ops",
          description: "Ocorreu algum erro. Tente novamente",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        setLoading(false);
      });
  };
  return (
    <>
      <Flex height="100vh" background="linear-gradient(to right, red, #ff8c00)">
        <Box flex="1" bg="red" display={{ base: "none", lg: "block" }}>
          <Image
            src={future}
            alt="Imagem"
            objectFit="cover"
            height="100%"
            width="100%"
          />
        </Box>

        <Box
          flex="1"
          display="flex"
          justifyContent="center"
          flexDirection="column"
        >
          <Box margin="0 auto" w="100%" maxW="370px" mt="20px">
            <Text textAlign="center" fontSize="40px" mb="30px" color="white">
              Future{" "}
              <Text as="span" fontWeight="bold" color="#5CB646">
                Eats
              </Text>
            </Text>
            <Text mb="20px" color="white">
              Cadastre seu Endereço
            </Text>
            <FormControl mt="10px">
              <FormLabel color="white">Rua</FormLabel>
              <Input
                padding="10px"
                maxW="370px"
                type="text"
                bg="white"
                placeholder="Digite sua rua"
                border="none"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </FormControl>

            <FormControl mt="10px">
              <FormLabel color="white">Número</FormLabel>
              <Input
                padding="10px"
                w="100%"
                maxW="370px"
                bg="white"
                type="number"
                placeholder="Número da residência"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </FormControl>

            <FormControl mt="10px">
              <FormLabel color="white">Bairro</FormLabel>
              <Input
                padding="10px"
                w="100%"
                maxW="370px"
                bg="white"
                type="text"
                placeholder="Seu bairro"
                value={neighbourhood}
                onChange={(e) => setNeighbourhood(e.target.value)}
              />
            </FormControl>

            <FormControl mt="10px">
              <FormLabel color="white">Cidade</FormLabel>
              <Input
                padding="10px"
                w="100%"
                bg="white"
                maxW="370px"
                type="name"
                placeholder="Sua cidade"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </FormControl>

            <FormControl mt="10px">
              <FormLabel color="white">Estado</FormLabel>
              <Input
                padding="10px"
                w="100%"
                bg="white"
                maxW="370px"
                type="name"
                placeholder="Seu estado"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </FormControl>

            <FormControl mt="10px">
              <FormLabel color="white">Complemento</FormLabel>
              <Input
                padding="10px"
                w="100%"
                maxW="370px"
                bg="white"
                type="name"
                placeholder="Digite o complemento"
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
              />
            </FormControl>
          </Box>

          <Box margin="0 auto" w="100%" maxW="370px" mt="20px">
            <Button
              isLoading={loading}
              loadingText="Realizando cadastro"
              variant="outline"
              spinnerPlacement="start"
              onClick={onSubmit}
              w="100%"
              bg="#5CB646"
            >
              Cadastrar Endereço
            </Button>
          </Box>
        </Box>
      </Flex>
    </>
  );
};
export default SignUpAddress;
