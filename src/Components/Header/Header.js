import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Divider,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useResults } from "../Context/GlobalContext";

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile, setIsMobile] = useState(false);
  const { token, setToken } = useResults();

  const navigate = useNavigate();

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const confirmLogin = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
    setToken(localStorage.removeItem("token"));
  };

  return (
    <Flex
      as="header"
      alignItems="center"
      justifyContent="space-between"
      bg="#5CB646"
      p={4}
      color="white"
    >
      <Box>
        <Text fontSize="2xl">Logo</Text>
      </Box>
      {isMobile ? (
        <IconButton
          icon={<HamburgerIcon />}
          onClick={onOpen}
          aria-label="Abrir menu"
          variant="ghost"
        />
      ) : (
        <Flex as="nav" alignItems="center">
          <Button
            variant="outline"
            color="white"
            border="none"
            _hover={{ bg: "#CCC" }}
            mr={4}
            onClick={(e) => navigate("/feed")}
          >
            Início
          </Button>

          <Button
            variant="outline"
            color="white"
            border="none"
            _hover={{ bg: "#CCC" }}
            onClick={(e) => navigate("/pagamento")}
          >
            Carrinho
          </Button>

          <Button
            variant="outline"
            color="white"
            border="none"
            _hover={{ bg: "#CCC" }}
            mr={4}
            onClick={(e) => navigate("/perfil")}
          >
            Perfil
            {}
          </Button>

          <Button
            variant="outline"
            color="white"
            border="none"
            _hover={{ bg: "#CCC" }}
            mr={4}
            onClick={(e) => {
              logout();
              onClose();
            }}
          >
            {confirmLogin ? "Logout" : "Login"}
          </Button>
        </Flex>
      )}

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody m="10px">
            <Flex as="nav" flexDirection="column" alignItems="flex-end" mt={4}>
              <Text
                paddingBottom="10px"
                mr={4}
                onClick={(e) => {
                  navigate("/feed");
                  onClose();
                }}
              >
                Início
              </Text>
              <Divider />

              <Text
                paddingTop="10px"
                mb={4}
                onClick={(e) => {
                  navigate("/pagamento");
                  onClose();
                }}
              >
                Carrinho
              </Text>
              <Divider />

              <Text
                paddingTop="10px"
                mb={4}
                onClick={(e) => {
                  navigate("/perfil");
                  onClose();
                }}
              >
                Perfil
              </Text>

              <Text
                paddingTop="10px"
                mb={4}
                onClick={(e) => {
                  logout();
                  onClose();
                }}
              >
                {confirmLogin ? "Logout" : "Login"}
              </Text>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default Header;
