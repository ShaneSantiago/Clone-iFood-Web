import { Box, Card, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../Constants/url";

const OrderHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    orderHistory();
  }, []);

  const orderHistory = () => {
    const config = {
      headers: { auth: localStorage.getItem("token") },
    };
    axios
      .get(`${BASE_URL}/orders/history`, config)
      .then((res) => {
        console.log("Sucesso", res.data.orders);
        setHistory(res.data.orders);
      })
      .catch((erro) => {
        console.log("Erro", erro.response.data);
      });
  };

  // Função para formatar uma data em "Dia Mês Ano"
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    const months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} de ${month} de ${year}`;
  };

  return (
    <>
      <Box>
        <Text m="10px">Detalhes dos pedidos realizados</Text>
        {history.map((item) => {
          const formattedDate = formatTimestamp(item.createdAt);
          return (
            <Box key={item.id} display="flex" alignItems="center" m="10px">
              <Card
                border="2px solid #ccc"
                w={{ base: "100%", lg: "300px" }}
                padding="10px"
              >
                <Text color="#5CB646" fontSize="18px">
                  {" "}
                  {item.restaurantName}
                </Text>
                <Text>Data: {formattedDate}</Text>
                <Text>
                  Preço Total: R$ {item.totalPrice.toFixed(2).replace(".", ",")}
                </Text>
              </Card>
            </Box>
          );
        })}
      </Box>
    </>
  );
};
export default OrderHistory;
