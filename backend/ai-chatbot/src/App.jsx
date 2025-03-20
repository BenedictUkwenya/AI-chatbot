import { Box, Input, Button, VStack, Text, HStack, Spinner } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput(""); // Clear input field
    setLoading(true); // Show typing indicator

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        message: input,
      });

      const botMessage = { text: response.data.reply, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prevMessages) => [...prevMessages, { text: "Failed to get response. Try again!", sender: "bot" }]);
    } finally {
      setLoading(false); // Hide typing indicator
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <VStack
      p={5}
      spacing={6}
      bgGradient="linear(to-br, blue.800, purple.700)"
      minH="100vh"
      justify="center"
      align="center"
    >
      <Text
        fontSize="3xl"
        fontWeight="bold"
        color="white"
        mb={4}
        textAlign="center"
        textShadow="1px 1px 2px rgba(0, 0, 0, 0.5)"
      >
        AI Chat Box
      </Text>
      <Box
        w={{ base: "90%", md: "400px" }}
        h={{ base: "70%", md: "500px" }}
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        bg="white"
        boxShadow="2xl"
        overflowY="auto"
      >
        {messages.map((msg, index) => (
          <HStack
            key={index}
            justify={msg.sender === "user" ? "flex-end" : "flex-start"}
            mb={3}
          >
            <Box
              bg={msg.sender === "user" ? "blue.500" : "gray.200"}
              color={msg.sender === "user" ? "white" : "black"}
              px={4}
              py={2}
              borderRadius="lg"
              maxW="70%"
              boxShadow="md"
            >
              <Text fontSize="sm">
                <b>{msg.sender === "user" ? "You:" : "AI:"}</b> {msg.text}
              </Text>
            </Box>
          </HStack>
        ))}

        {loading && (
          <HStack justify="flex-start" mb={3}>
            <Box
              bg="gray.200"
              color="black"
              px={4}
              py={2}
              borderRadius="lg"
              maxW="70%"
              boxShadow="md"
            >
              <Spinner size="sm" mr={2} /> <Text display="inline">AI is typing...</Text>
            </Box>
          </HStack>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <HStack w={{ base: "90%", md: "400px" }} spacing={3}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          bg="white"
          borderRadius="lg"
          boxShadow="sm"
          _placeholder={{ color: "gray.500" }}
          color="black"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()} // Send message on Enter key
        />
        <Button
          onClick={sendMessage}
          colorScheme="blue"
          borderRadius="lg"
          isDisabled={loading}
          boxShadow="md"
        >
          Send
        </Button>
      </HStack>
    </VStack>
  );
}

export default App;
