import {
  Box,
  Button,
  Flex,
  FormControl,
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
      <Flex height="100vh">
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
            <Text textAlign="center" fontSize="40px" mb="50px">
              Future{" "}
              <Text as="span" fontWeight="bold" color="#5CB646">
                Eats
              </Text>
            </Text>
            <Text mb="20px">Cadastre-se</Text>
            <FormControl mt="20px">
              <FormLabel>E-mail</FormLabel>
              <Input
                padding="10px"
                maxW="370px"
                type="text"
                placeholder="Digite seu e-mail"
                border="none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl mt="20px">
              <FormLabel>Nome</FormLabel>
              <Input
                padding="10px"
                w="100%"
                maxW="370px"
                type="name"
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl mt="20px">
              <FormLabel>CPF</FormLabel>
              <Input
                padding="10px"
                w="100%"
                maxW="370px"
                type="number"
                placeholder="Digite seu CPF sem traços ou pontos"
                value={cpf}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt="20px">
              <FormLabel>Senha</FormLabel>
              <Input
                padding="10px"
                w="100%"
                maxW="370px"
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
              variant="outline"
              spinnerPlacement="start"
              onClick={onSubmit}
              w="100%"
              bg="#5CB646"
            >
              Cadastrar
            </Button>
            <Box mt="20px">
              <Link onClick={() => navigate("/")}>
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
