import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Image,
  Input,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../../Constants/url";
import future from "../../assets/future.png";
import { useNavigate } from "react-router-dom";
import UnProtectedPage from "../../Components/Hooks/useUnprotectedPage";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();

    if (!email || !name || !cpf || !password) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    // Validação do formato do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Erro",
        description: "Digite um e-mail válido.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    // Validação do CPF (neste exemplo, apenas verifica se tem 11 dígitos)
    if (cpf.length !== 11) {
      toast({
        title: "Erro",
        description: "Digite um CPF válido.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    signup();
  };

  const signup = () => {
    setLoading(true);
    const body = {
      email: email,
      name: name,
      cpf: cpf,
      password: password,
    };
    axios
      .post(`${BASE_URL}/signup`, body)
      .then((res) => {
        setLoading(true);
        localStorage.setItem("token", res.data.token);
        console.log("Sucesso", res.data);
        toast({
          title: "Sucesso",
          description: "Seu cadastro foi realizado com sucesso",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        navigate("/cadastro/endereco");
        setLoading(false);
      })
      .catch((erro) => {
        console.log("Erro", erro.response.data);
        setLoading(true);
        toast({
          title: "Ops",
          description: "Email ou CPF já cadastrados",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const newCpf = e.target.value.replace(/\D/g, "");

    if (newCpf.length <= 11) {
      setCpf(newCpf);
    }
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
          mb="30px"
        >
          <Box margin="0 auto" w="100%" maxW="370px" mt="20px">
            <Text textAlign="center" fontSize="40px" mb="50px" color="white">
              Future{" "}
              <Text as="span" fontWeight="bold" color="#5CB646">
                Eats
              </Text>
            </Text>
            <Text mb="20px" color="white">
              Cadastre-se
            </Text>
            <FormControl mt="20px">
              <FormLabel color="white">E-mail</FormLabel>
              <Input
                padding="10px"
                maxW="370px"
                type="text"
                bg="white"
                placeholder="Digite seu e-mail"
                border="none"
                value={email}
                isRequired
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl mt="20px">
              <FormLabel color="white">Nome</FormLabel>
              <Input
                padding="10px"
                w="100%"
                maxW="370px"
                bg="white"
                type="name"
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl mt="20px">
              <FormLabel color="white">CPF</FormLabel>
              <Input
                padding="10px"
                w="100%"
                maxW="370px"
                bg="white"
                type="number"
                placeholder="Digite seu CPF sem traços ou pontos"
                value={cpf}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt="20px">
              <FormLabel color="white">Senha</FormLabel>
              <Input
                padding="10px"
                w="100%"
                maxW="370px"
                bg="white"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
          </Box>

          <Box margin="0 auto" w="100%" maxW="370px" mt="20px">
            <Button
              isLoading={loading}
              loadingText="Realizando cadastro"
              color="white"
              spinnerPlacement="start"
              onClick={onSubmit}
              w="100%"
              bg="#5CB646"
            >
              Cadastrar
            </Button>
            <Box mt="20px">
              <Link onClick={() => navigate("/")} color="white">
                Já possui cadastro? Faça Login
              </Link>
            </Box>
          </Box>
        </Box>
      </Flex>
    </>
  );
};
export default SignUp;
