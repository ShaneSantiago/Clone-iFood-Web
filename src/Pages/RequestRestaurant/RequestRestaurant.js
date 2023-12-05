import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../Constants/url";
import { SearchIcon } from "@chakra-ui/icons";
import { useResults } from "../../Components/Context/GlobalContext";
import UseProtectedPage from "../../Components/Hooks/useProtectedPage";
import ifood from "../../assets/ifood.jpg";

const RequestRestaurant = () => {
  UseProtectedPage();
  const [restaurant, setRestaurant] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const { cart, setCart } = useResults();
  const toast = useToast();
  const params = useParams();

  const handleAddItemToCart = () => {
    if (selectedItem && quantity > 0) {
      const itemIndex = cart.findIndex((item) => item.id === selectedItem.id);

      if (itemIndex !== -1) {
        const updatedCart = [...cart];
        updatedCart[itemIndex].quantity += quantity;

        setCart(updatedCart);
        toast({
          title: "Pronto",
          description: "Foi adicionado no carrinho",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        const itemWithQuantity = {
          ...selectedItem,
          quantity: quantity,
          freight: restaurant.shipping,
          idRestaurant: restaurant.id,
        };

        setCart([...cart, itemWithQuantity]);
        toast({
          title: "Pronto",
          description: "Foi adicionado no carrinho",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }

      setIsOpen(false);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => setIsOpen(false);

  useEffect(() => {
    restaurantId();
  }, []);

  const restaurantId = () => {
    const config = {
      headers: { auth: localStorage.getItem("token") },
    };
    axios
      .get(`${BASE_URL}/restaurants/${params.id}`, config)
      .then((res) => {
        console.log("Sucesso", res.data);
        setRestaurant(res.data.restaurant);
      })
      .catch((erro) => {
        console.log("Erro", erro);
      });
  };

  console.log("teste", restaurant);
  return (
    <>
      <Box background="linear-gradient(to right, red, #ff8c00)">
        <Box padding="20px">
          <Flex
            w={{ base: "100%", lg: "75%" }}
            m="0 auto"
            flexDirection="column"
            marginTop="70px"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt="10px"
            >
              <Box display="flex" flexDirection="column">
                <Text fontWeight="500" fontSize="50px" color="white">
                  Faça seu pedido no
                  <span style={{ color: "#5CB646" }}> Future Eats</span>
                </Text>

                {restaurant.length === 0 ? (
                  <Box
                    w="100%"
                    display="flex"
                    alignItems="flex-start"
                    justifyContent="center"
                  >
                    <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="blue.500"
                      size="xl"
                    />
                  </Box>
                ) : (
                  <>
                    <Box w={{ base: "100%", lg: "100%" }} mb="20px" m="0 auto">
                      <Box w="100%" borderRadius="20px" mt="20px">
                        {" "}
                        {/* <Image src={restaurant.logoUrl} alt="restaurantes" h="200px" /> */}
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="flex-start"
                        >
                          <Text fontSize="30px" color="white">
                            {restaurant.name}
                          </Text>
                          <Text color="white">
                            Tempo de entrega: {restaurant.deliveryTime} Min
                          </Text>
                          <Text color="white">
                            Valor entrega: R${" "}
                            {Number(restaurant.shipping)
                              .toFixed(2)
                              .replace(".", ",")}
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  </>
                )}
              </Box>

              <Box width="40%" borderRadius={20}>
                <Image
                  src={ifood}
                  alt="imagem"
                  mt="30px"
                  borderRadius="20px 20px 20px 20px"
                />
              </Box>
            </Box>
          </Flex>
        </Box>
      </Box>

      <Card
        display="flex"
        w="100%"
        flexWrap="wrap"
        background="linear-gradient(to right, red, #ff8c00)"
      >
        <Box
          w="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt="30px"
        >
          <SearchIcon size={20} color="#fff" />

          <Input
            w="70%"
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Ex: Pastel, refrigerante"
            bg="white"
            style={{
              border: "2px solid #ccc",
              outline: "none",
              marginLeft: "10px",
            }}
          />
        </Box>
        {restaurant.products ? (
          <Box
            display="flex"
            flexWrap="wrap"
            alignItems="center"
            justifyContent="center"
            w="100%"
          >
            {restaurant.products
              ?.filter((nameProduct) => {
                return nameProduct.name
                  .toLowerCase()
                  .includes(filter.toLowerCase());
              })

              .map((item) => (
                <Card
                  key={item.id}
                  m="15px"
                  mt="80px"
                  border="1px solid #fff"
                  bg="transparent"
                  borderRadius="20px"
                  overflow="hidden" // Para garantir que a sombra não ultrapasse os limites do card
                  boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)" // Adiciona uma sombra sutil
                  transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
                  _hover={{
                    transform: "scale(1.05)",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <Image
                    src={item.photoUrl}
                    alt="produtos"
                    w="350px"
                    h="200px"
                    mb="10px"
                  />

                  <Box mt="10px" padding="10px">
                    <Text color="white" fontSize="18px">
                      {" "}
                      {item.name}
                    </Text>
                    <Divider mt="10px" mb="10px" />
                    <Text color="white">{item.description}</Text>
                    <Text color="white" fontSize="20px">
                      R${item.price.toFixed(2).replace(".", ",")}
                    </Text>

                    <Box display="flex" justifyContent="space-between">
                      {cart.map((quant) => {
                        return (
                          <Box
                            key={quant.id}
                            display="flex"
                            alignItems="center"
                          >
                            {quant.id === item.id ? (
                              <>
                                <Text color="white">Quantidade:</Text>
                                <Text m="10px" color="white" textAlign="center">
                                  {" "}
                                  {quant.quantity}
                                </Text>
                              </>
                            ) : null}
                          </Box>
                        );
                      })}

                      <Box display="flex" justifyContent="flex-end">
                        <Button
                          color="white"
                          variant="outline"
                          bg="#5CB646"
                          onClick={() => {
                            setSelectedItem(item);
                            setQuantity("");
                            setIsOpen(true);
                          }}
                        >
                          Adicionar
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              ))}
          </Box>
        ) : (
          <Box
            w="100%"
            display="flex"
            alignItems="flex-start"
            justifyContent="center"
          >
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Box>
        )}
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Escolha a quantidade</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Select
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            >
              <option>0</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
              <option>9</option>
              <option>10</option>
            </Select>
            <Box mt="20px" display="flex" justifyContent="end">
              <Button onClick={handleAddItemToCart} bg="#5CB646" color="white">
                Adicionar ao carrinho
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default RequestRestaurant;
