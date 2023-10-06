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
import { useResults } from "../../Components/Context/GlobalContext";

const Login = () => {
  UnProtectedPage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { token, setToken } = useResults();

  const toast = useToast();

  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    login();
  };

  const login = () => {
    setLoading(true);
    const body = {
      email: email,
      password: password,
    };
    axios
      .post(`${BASE_URL}/login`, body)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        toast({
          title: "Sucesso",
          description: "Login efetuado com sucesso",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        navigate("/feed");
        setToken(localStorage.getItem("token"));
        setLoading(false);
      })
      .catch((erro) => {
        setLoading(true);
        console.log("Erro", erro.response.data);
        toast({
          title: "Ops",
          description:
            "Algo deu errado. Por favor, verifique se seu e-mail e senha estão corretos",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        setLoading(false);
      });
  };
  return (
    <>
      <Flex height="100vh">
        <Box
          flex="1"
          display="flex"
          justifyContent="center"
          flexDirection="column"
          m="20px"
        >
          <Box margin="0 auto" w="100%" maxW="370px" mt="20px">
            <Text textAlign="center" fontSize="40px" mb="50px">
              Future{" "}
              <Text as="span" fontWeight="bold" color="#5CB646">
                Eats
              </Text>
            </Text>
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
              loadingText="Fazendo login"
              variant="outline"
              spinnerPlacement="start"
              onClick={onSubmit}
              w="100%"
              bg="#5CB646"
            >
              Entrar
            </Button>
            <Box mt="20px">
              <Link onClick={() => navigate("/cadastro")}>
                Não tem cadastro? Cadastre-se agora
              </Link>
            </Box>
          </Box>
        </Box>

        <Box flex="1" display={{ base: "none", lg: "block" }}>
          <Image
            src={future}
            alt="Imagem"
            objectFit="cover"
            height="100%"
            width="100%"
          />
        </Box>
      </Flex>
    </>
  );
};
export default Login;
