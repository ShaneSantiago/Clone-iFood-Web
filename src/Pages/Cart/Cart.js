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
import React, { useEffect, useState } from "react";
import { useResults } from "../../Components/Context/GlobalContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../Constants/url";
import UseProtectedPage from "../../Components/Hooks/useProtectedPage";

const Cart = () => {
  UseProtectedPage();
  const { cart, setCart } = useResults();
  const [checkBox, setCheckBox] = useState(false);
  const [checkBoxCredit, setCheckBoxCredit] = useState(false);
  const [orderErro, setOrderErro] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState("creditcard");
  const toast = useToast();

  const params = useParams();

  let total = 0;
  let frete = cart.map((item) => {
    return item.freight;
  });

  const listaItens = cart?.map((item) => {
    const subtotal = item.quantity * item.price;
    total += subtotal;
  });

  const totalItems = total + frete[0];

  const incrementQuantity = (itemId) => {
    const updatedCart = cart.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const decrementQuantity = (itemId) => {
    const updatedCart = cart.map((item) => {
      if (item.id === itemId && item.quantity > 0) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const submitOrder = () => {
    if (checkBox === false && checkBoxCredit === false) {
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
        setOrderErro(res.data);
        // console.log("Sucesso", res.data);
        setLoading(false);
      })
      .catch((erro) => {
        console.log("Erro");
      });
  }, []);

  let createdAtFormatted = "";
  let expiresAtFormatted = "";

  if (orderErro.order) {
    const createdAtTimestamp = orderErro.order.createdAt;
    const expiresAtTimestamp = orderErro.order.expiresAt;

    if (createdAtTimestamp && expiresAtTimestamp) {
      const createdAtDate = new Date(createdAtTimestamp);
      const expiresAtDate = new Date(expiresAtTimestamp);

      createdAtFormatted = createdAtDate.toLocaleString();
      expiresAtFormatted = expiresAtDate.toLocaleString();
    }
  }

  return (
    <>
      <Box padding="20px">
        <Flex w={{ base: "100%", lg: "70%" }} m="0 auto" flexDirection="column">
          <Text fontWeight="500" fontSize="35px">
            Faça seu pagamento para concluir seu pedido no
            <span style={{ color: "#5CB646" }}> Future Eats</span>
          </Text>
        </Flex>
      </Box>
      <Box display="flex" flexDirection={{ base: "column", lg: "row" }}>
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="space-between"
          w={{ base: "100%", lg: "70%" }}
        >
          {cart.map((item) => {
            return (
              <Card key={item.id} m="15px" h="400px">
                <Image
                  src={item.photoUrl}
                  alt="produtos"
                  w="350px"
                  h="200px"
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

                  <Box display="flex" flexWrap="wrap" mt="10px">
                    {cart.map((quant) => {
                      return (
                        <Box
                          key={quant.id}
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          w="100%"
                        >
                          {quant.id === item.id ? (
                            <>
                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                w="100%"
                              >
                                <Button
                                  bg="red"
                                  color="white"
                                  onClick={() => decrementQuantity(quant.id)}
                                >
                                  -
                                </Button>
                                <Text ml="10px" marginRight="10px">
                                  Quantidade:
                                </Text>
                                <Text
                                  m="10px"
                                  color="#5CB646"
                                  textAlign="center"
                                >
                                  {" "}
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
                          ) : null}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Card>
            );
          })}
        </Box>

        <Box w={{ base: "100%", lg: "30%" }} h="100vh" m="20px">
          <Text fontSize="25px" textAlign="center" mb="20px">
            Pagamento
          </Text>
          {cart.length < 1 ? (
            <>
              <Text>Nenhum produto foi adicionado</Text>
            </>
          ) : (
            <>
              <Text>
                Frete: R${Number(frete[0]).toFixed(2).replace(".", ",")}
              </Text>
              <Text>Subtotal: R${total.toFixed(2).replace(".", ",")}</Text>
              <Text>Total: R${totalItems.toFixed(2).replace(".", ",")}</Text>
            </>
          )}
          <Box mt="20px">
            <Text fontWeight="500">Forma de pagamento</Text>
            <Divider />
          </Box>
          <Box mt="10px">
            <FormLabel display="flex" alignItems="center">
              <Checkbox
                checked={checkBox}
                isDisabled={checkBoxCredit === true}
                onChange={() => setCheckBox(!checkBox)}
              />
              Dinheiro
            </FormLabel>
            <FormLabel display="flex" alignItems="center">
              <Checkbox
                checked={checkBoxCredit}
                isDisabled={checkBox === true}
                onChange={() => setCheckBoxCredit(!checkBoxCredit)}
              />
              Cartão de Crédito
            </FormLabel>
          </Box>

          <Box w="100%" mt="20px">
            <Button onClick={submitOrder} bg="#5CB646" w="100%" color="white">
              Confirmar
            </Button>
          </Box>

          {orderErro.order ? (
            <>
              <Alert display="flex" flexDirection="column" mt="10px">
                <Box>
                  <Text>Restaurante: {orderErro.order?.restaurantName}</Text>
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
            </>
          ) : null}
        </Box>
      </Box>
    </>
  );
};
export default Cart;
