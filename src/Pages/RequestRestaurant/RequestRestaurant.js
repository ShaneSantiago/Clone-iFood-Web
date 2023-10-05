import {
  Box,
  Button,
  Card,
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

const RequestRestaurant = () => {
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

  return (
    <>
      <Box>
        <Box padding="20px">
          <Flex
            w={{ base: "100%", lg: "70%" }}
            m="0 auto"
            flexDirection="column"
          >
            <Text fontWeight="500" fontSize="50px" textAlign="center">
              Faça seu pedido no
              <span style={{ color: "#5CB646" }}> Future Eats</span>
            </Text>
            <Text></Text>

            <Box
              w="100%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt="30px"
            >
              <SearchIcon size={20} color="#555" />

              <Input
                w="80%"
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Ex: Pastel, refrigerante"
                style={{ border: "none", outline: "none", marginLeft: "10px" }}
              />
            </Box>
          </Flex>
        </Box>
        <Box w={{ base: "100%", lg: "70%" }} mb="20px" px="10px" m="0 auto">
          <Card w="100%">
            {" "}
            {/* <Image src={restaurant.logoUrl} alt="restaurantes" h="200px" /> */}
            <Box
              mt="10px"
              display="flex"
              flexDirection="column"
              alignItems="center"
              m="20px"
            >
              <Text fontSize="30px" color="#5CB646">
                {restaurant.name}
              </Text>
              <Text>Tempo de entrega: {restaurant.deliveryTime} Min</Text>
              <Text>
                Valor entrega: R${" "}
                {Number(restaurant.shipping).toFixed(2).replace(".", ",")}
              </Text>
            </Box>
          </Card>
        </Box>
      </Box>
      <Card display="flex" w="100%" flexWrap="wrap">
        <Box
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="center"
        >
          {restaurant.products
            ?.filter((nameProduct) => {
              return nameProduct.name
                .toLowerCase()
                .includes(filter.toLowerCase());
            })

            .map((item) => (
              <Card key={item.id} m="15px" padding="20px" h="350px">
                <Image
                  src={item.photoUrl}
                  alt="produtos"
                  w="350px"
                  h="150px"
                  border="1px solid #CCC"
                  mb="10px"
                />

                <Box mt="10px">
                  <Text color="#5CB646" fontSize="18px">
                    {" "}
                    {item.name}
                  </Text>
                  <Text>{item.description}</Text>
                  <Text fontSize="20px">
                    R${item.price.toFixed(2).replace(".", ",")}
                  </Text>

                  <Box display="flex" justifyContent="space-between">
                    {cart.map((quant) => {
                      return (
                        <Box key={quant.id} display="flex" alignItems="center">
                          {quant.id === item.id ? (
                            <>
                              <Text>Quantidade:</Text>
                              <Text m="10px" color="#5CB646" textAlign="center">
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
                        color="#5CB646"
                        variant="outline"
                        border="2px"
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
              <Button
                onClick={handleAddItemToCart}
                color="#5CB646"
                variant="outline"
                border="2px"
              >
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
