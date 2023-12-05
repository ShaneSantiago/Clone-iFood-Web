import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Image,
  Input,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../Constants/url";
import {
  ResultsProvider,
  useResults,
} from "../../Components/Context/GlobalContext";
import FilterButton from "./FilterButton";
import { useNavigate } from "react-router-dom";
import UseProtectedPage from "../../Components/Hooks/useProtectedPage";
import ifood from "../../assets/ifood.jpg";

const Feedpage = () => {
  UseProtectedPage();
  const { allRestaurantes, setAllRestaurants } = useResults();
  const [filter, setFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    restaurants();
  }, []);

  const handleFilter = (e) => {
    setFilter(e.target.value);
  };

  const restaurants = () => {
    const config = {
      headers: { auth: localStorage.getItem("token") },
    };
    axios
      .get(`${BASE_URL}/restaurants`, config)
      .then((res) => {
        // console.log("Sucesso", res.data);
        setAllRestaurants(res.data.restaurants);
      })
      .catch((erro) => {
        console.log("Erro", erro.response.data);
      });
  };

  const uniqueCategories = allRestaurantes.reduce((categories, restaurant) => {
    if (!categories.includes(restaurant.category)) {
      categories.push(restaurant.category);
    }
    return categories;
  }, []);

  const goToRequest = (item) => {
    navigate(`/pedido/${item.id}`);
  };

  return (
    <>
      <Box
        w="100%"
        // h="100vh"
        display="flex"
        alignItems="center"
        flexDirection="column"
        background="linear-gradient(to right, red, #ff8c00)"
      >
        <Box padding="20px" marginTop="120px">
          <Flex
            w={{ base: "100%", lg: "85%" }}
            m="0 auto"
            flexDirection="column"
            height="500px"
          >
            <Box display="flex" justifyContent="space-between">
              <Box w={{ base: "100%", lg: "50%" }}>
                <Text fontWeight="500" fontSize="50px" color="white">
                  Descubra Sabores do Futuro com o
                  <span style={{ color: "#5CB646" }}> Future Eats</span>
                </Text>
                <Text color="white">
                  O Future Eats é a sua passagem para um mundo de deliciosas
                  descobertas gastronômicas. Explore restaurantes locais, pratos
                  internacionais e tendências culinárias que vão alimentar o seu
                  paladar e transformar o futuro das suas refeições. Peça agora
                  e experimente a próxima geração de sabores
                </Text>
              </Box>

              <Box w={{ base: "none", lg: "45%" }} height="300px">
                <Image
                  src={ifood}
                  alt="ifood"
                  width="100%"
                  borderRadius="50px"
                  height="300px"
                  display={{ base: "none", lg: "block" }}
                />
              </Box>
            </Box>

            <Box
              w="100%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt="30px"
            >
              <SearchIcon size={20} color="white" mt="50px" />

              <Input
                w="80%"
                type="text"
                marginTop="50px"
                value={filter}
                onChange={handleFilter}
                placeholder="Buscar por restaurante"
                style={{ border: "none", outline: "none", marginLeft: "10px" }}
                backgroundColor="white"
              />
            </Box>
          </Flex>
        </Box>
        <Flex
          w="100%"
          overflowX="auto"
          alignItems="center"
          justifyContent="center"
          flexDirection={{ base: "row", lg: "row" }}
          flexWrap="nowrap"
          style={{ whiteSpace: "nowrap" }}
        >
          {uniqueCategories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={category === selectedCategory ? "solid" : "outline"}
              bg="#ff4500"
              m="20px"
              color="white"
              border="none"
              minW="100px"
              fontSize="16px"
              whiteSpace="nowrap"
              flex="0 0 auto"
            >
              {category}
            </Button>
          ))}
        </Flex>
        <Button m="20px" onClick={() => setSelectedCategory(null)}>
          Limpar Filtro
        </Button>

        <Divider w="90%" />

        <Box w="100%" mt="50px">
          {/* <Box
            display="flex"
            justifyContent="center"
            mb="20px"
            style={{ overflowX: "auto" }}
            w="100%"
          >
            {uniqueCategories.map((category) => (
              <Button
                w={{ base: "100%", lg: "100px" }}
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={category === selectedCategory ? "solid" : "outline"}
                colorScheme="teal"
                m="20px"
              >
                {category}
              </Button>
            ))}
            <Button m="20px" onClick={() => setSelectedCategory(null)}>
              Limpar Filtro
            </Button>
          </Box> */}

          <Box display="flex" flexWrap="wrap" w="100%" justifyContent="center">
            {allRestaurantes
              .filter((restaurant) => {
                if (!selectedCategory) return true;
                return restaurant.category === selectedCategory;
              })
              .filter((item) => {
                return item.name.toLowerCase().includes(filter.toLowerCase());
              })
              .map((item) => {
                return (
                  <Box
                    key={item.id}
                    w={{ base: "100%", lg: "30%" }}
                    mb="20px"
                    px="10px"
                  >
                    <Card
                      w="100%"
                      border="1px solid #fff"
                      bg="transparent"
                      borderRadius="20px"
                      overflow="hidden"
                      boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
                      transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
                      _hover={{
                        transform: "scale(1.05)",
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      {" "}
                      <Image src={item.logoUrl} alt="restaurantes" h="200px" />
                      <Box
                        mt="10px"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        m="20px"
                      >
                        <Text fontSize="20px" color="white">
                          {item.name}
                        </Text>
                        <Divider
                          mt="10px"
                          style={{ backgroundColor: "#ff4500" }}
                        />
                      </Box>
                      <Box mt="auto" ml="20px" mb="20px">
                        <Text color="white">
                          Tempo de entrega: {item.deliveryTime} Min
                        </Text>
                        <Text color="white">
                          Valor: R$ {item.shipping.toFixed(2).replace(".", ",")}
                        </Text>
                      </Box>
                      <Button
                        bg="#5CB646"
                        margin="20px"
                        color="white"
                        onClick={(e) => goToRequest(item)}
                      >
                        Fazer Pedido
                      </Button>
                    </Card>
                  </Box>
                );
              })}
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default Feedpage;
