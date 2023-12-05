import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Flex,
  FormLabel,
  HStack,
  Image,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { BASE_URL } from "../../Constants/url";
import { useResults } from "../../Components/Context/GlobalContext";
import UseProtectedPage from "../../Components/Hooks/useProtectedPage";

const Cart = () => {
  UseProtectedPage();
  const { cart, setCart } = useResults();
  const [checkBox, setCheckBox] = useState(false);
  const [checkBoxCredit, setCheckBoxCredit] = useState(false);
  const [orderError, setOrderError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState("creditcard");
  const toast = useToast();

  const navigate = useNavigate();

  const params = useParams();

  // Calculate total and freight
  let total = 0;
  let freight = cart.map((item) => item.freight);
  const itemList = cart?.map((item) => {
    const subtotal = item.quantity * item.price;
    total += subtotal;
  });
  const totalItems = total + freight[0];

  // Increase quantity of an item
  const incrementQuantity = (itemId) => {
    const updatedCart = cart.map((item) =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
  };

  const decrementQuantity = (itemId) => {
    const updatedCart = cart.map((item) =>
      item.id === itemId && item.quantity > 0
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updatedCart);
  };

  const submitOrder = () => {
    if (!checkBox && !checkBoxCredit) {
      toast({
        title: "Ops",
        description:
          "Você precisa selecionar a forma de pagamento. Crédito ou Débito",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      order();
    }
  };

  const order = () => {
    const restaurantIds = [...new Set(cart.map((item) => item.idRestaurant))];

    restaurantIds.forEach((restaurantId) => {
      const products = cart
        .filter((item) => item.idRestaurant === restaurantId)
        .map((item) => ({
          id: item.id,
          quantity: item.quantity,
        }));

      const body = {
        products: products,
        paymentMethod: payment,
      };

      const headers = {
        headers: {
          auth: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };

      axios
        .post(`${BASE_URL}/restaurants/${restaurantId}/order`, body, headers)
        .then((res) => {
          toast({
            title: "Sucesso",
            description: "Seu pedido foi realizado com sucesso",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          setCart("");
          navigate("/feed");
        })
        .catch((error) => {
          if (error.response && error.response.status === 409) {
            toast({
              title: "Ops",
              description: "Já existe um pedido em andamento",
              status: "error",
              duration: 9000,
              isClosable: true,
            });
          } else {
            toast({
              title: "Ops",
              description: "Ocorreu algum erro",
              status: "error",
              duration: 9000,
              isClosable: true,
            });
          }
        });
    });
  };

  useEffect(() => {
    setLoading(true);
    const headers = {
      headers: {
        auth: localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    };

    axios
      .get(`${BASE_URL}/active-order`, headers)
      .then((res) => {
        setOrderError(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching active order");
      });
  }, []);

  let createdAtFormatted = "";
  let expiresAtFormatted = "";

  if (orderError.order) {
    const createdAtTimestamp = orderError.order.createdAt;
    const expiresAtTimestamp = orderError.order.expiresAt;

    if (createdAtTimestamp && expiresAtTimestamp) {
      const createdAtDate = new Date(createdAtTimestamp);
      const expiresAtDate = new Date(expiresAtTimestamp);

      createdAtFormatted = createdAtDate.toLocaleString();
      expiresAtFormatted = expiresAtDate.toLocaleString();
    }
  }

  return (
    <>
      <Box height="100vh" background="linear-gradient(to right, red, #ff8c00)">
        <Box
          padding="20px"
          background="linear-gradient(to right, red, #ff8c00)"
        >
          <Flex
            w={{ base: "100%", lg: "70%" }}
            m="0 auto"
            flexDirection="column"
            marginTop="90px"
          >
            <Text fontWeight="500" fontSize="35px" mb="10px" color="white">
              Faça seu pagamento para concluir seu pedido no
              <span style={{ color: "#5CB646" }}> Future Eats</span>
            </Text>
          </Flex>
        </Box>

        <Box
          display="flex"
          flexDirection={{ base: "column", lg: "row" }}
          background="linear-gradient(to right, red, #ff8c00)"
        >
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            w={{ base: "100%", lg: "70%" }}
            height="100%"
          >
            {cart.map((item) => (
              <Card
                margin="20px"
                key={item.id}
                border="1px solid #CCC"
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
                <Image
                  src={item.photoUrl}
                  alt="produtos"
                  w="350px"
                  h="200px"
                  mb="10px"
                />

                <Box mt="10px" padding="10px">
                  <Text color="white" fontWeight="bold" fontSize="18px">
                    {item.name}
                  </Text>
                  <Divider mt="10px" mb="10px" />
                  <Text color="white">{item.description}</Text>
                  <Text color="white" fontSize="20px">
                    R$ {item.price.toFixed(2).replace(".", ",")}
                  </Text>

                  <Box display="flex" flexWrap="wrap" mt="10px">
                    {cart.map((quant) => (
                      <Box
                        key={quant.id}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        w="100%"
                      >
                        {quant.id === item.id && (
                          <>
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                              w="100%"
                            >
                              <Button
                                bg="red"
                                border="2px solid #fff"
                                color="white"
                                onClick={() => decrementQuantity(quant.id)}
                              >
                                -
                              </Button>
                              <Text ml="10px" marginRight="10px" color="white">
                                Quantidade:
                              </Text>
                              <Text m="10px" color="white" textAlign="center">
                                {quant.quantity}
                              </Text>
                              <Button
                                bg="green"
                                color="white"
                                onClick={() => incrementQuantity(quant.id)}
                              >
                                +
                              </Button>
                            </Box>
                          </>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>

          <Box
            w={{ base: "100%", lg: "30%" }}
            h="100%"
            m="20px"
            border="1px solid #fff"
            padding="10px"
          >
            <Text fontSize="25px" textAlign="center" mb="20px" color="white">
              Pagamento
            </Text>

            {cart.length < 1 ? (
              <Text>Nenhum produto foi adicionado</Text>
            ) : (
              <>
                <Text color="white">
                  Frete: R${Number(freight[0]).toFixed(2).replace(".", ",")}
                </Text>
                <Text color="white">
                  Subtotal: R${total.toFixed(2).replace(".", ",")}
                </Text>
                <Text color="white">
                  Total: R${totalItems.toFixed(2).replace(".", ",")}
                </Text>
              </>
            )}

            <Box mt="20px">
              <Text fontWeight="500" color="white">
                Forma de pagamento
              </Text>
              <Divider />
            </Box>
            <Box mt="10px">
              <FormLabel display="flex" alignItems="center" color="white">
                <Checkbox
                  checked={checkBox}
                  isDisabled={checkBoxCredit}
                  onChange={() => setCheckBox(!checkBox)}
                />
                Dinheiro
              </FormLabel>
              <FormLabel display="flex" alignItems="center" color="white">
                <Checkbox
                  checked={checkBoxCredit}
                  isDisabled={checkBox}
                  onChange={() => setCheckBoxCredit(!checkBoxCredit)}
                />
                Cartão de Crédito
              </FormLabel>
            </Box>

            <Box w="100%" mt="20px">
              <Button onClick={submitOrder} w="100%" bg="#5CB646" color="white">
                Confirmar
              </Button>
            </Box>

            {/* Order Details Section */}
            {orderError.order && (
              <Alert display="flex" flexDirection="column" mt="10px">
                <Box>
                  <Text>Restaurante: {orderError.order?.restaurantName}</Text>
                  <Divider />
                  <Text>Pedido criado em: {createdAtFormatted}</Text>
                  <Divider />
                  <Text>Expira em: {expiresAtFormatted}</Text>
                  <Divider />
                  <Text>
                    OBS: Só é possível fazer um novo pedido após a conclusão ou
                    cancelamento do primeiro
                  </Text>
                </Box>
              </Alert>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Cart;
