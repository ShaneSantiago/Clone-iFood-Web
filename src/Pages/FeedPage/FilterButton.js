import { Box, Button, Card, Image, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useResults } from "../../Components/Context/GlobalContext";

const FilterButton = () => {
  const { allRestaurantes, setAllRestaurants } = useResults();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const uniqueCategories = allRestaurantes.reduce((categories, restaurant) => {
    if (!categories.includes(restaurant.category)) {
      categories.push(restaurant.category);
    }
    return categories;
  }, []);

  return (
    <>
      <Box display="flex" justifyContent="center" mb="20px">
        {uniqueCategories.map((category) => (
          <Button
            key={category}
            onClick={() => setSelectedCategory(category)}
            variant={category === selectedCategory ? "solid" : "outline"}
            colorScheme="teal"
            mr="10px"
          >
            {category}
          </Button>
        ))}
        <Button onClick={() => setSelectedCategory(null)}>Limpar Filtro</Button>
      </Box>
      <Box display="flex" flexWrap="wrap" w="100%" justifyContent="center">
        {allRestaurantes
          .filter((restaurant) => {
            if (!selectedCategory) return true;
            return restaurant.category === selectedCategory;
          })
          .map((item) => {
            return (
              <Box
                key={item.id}
                w={{ base: "100%", lg: "30%" }}
                mb="20px"
                px="10px"
              >
                <Card w="100%" minH="470px">
                  {" "}
                  <Image src={item.logoUrl} alt="restaurantes" h="200px" />
                  <Box
                    mt="10px"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    m="20px"
                  >
                    <Text fontSize="20px" color="#5CB646">
                      {item.name}
                    </Text>
                    <Text>{item.description}</Text>
                  </Box>
                  <Box mt="auto" ml="20px">
                    <Text>Tempo de entrega: {item.deliveryTime} Min</Text>
                    <Text>
                      Valor: R$ {item.shipping.toFixed(2).replace(".", ",")}
                    </Text>
                  </Box>
                </Card>
              </Box>
            );
          })}
      </Box>
    </>
  );
};
export default FilterButton;
