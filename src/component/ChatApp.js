import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
  IconButton,
  InputAdornment,
  useMediaQuery,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import io from "socket.io-client";

const ChatApp = () => {
  const [chatMembers, setChatMembers] = useState([]);

  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userChatMessages, setUserChatMessages] = useState([]);
  const [chatWindowOpen, setChatWindowOpen] = useState(false);

   // Define the currentUser state (You should replace this with your authentication mechanism)
   const currentUser = {
    id: "your_user_id_here", // Replace this with the current user's ID
    // ... (Other user information)
  };

  // Define the getChatRoomId function to create a unique chat room ID
  const getChatRoomId = (userId1, userId2) => {
    // You can implement your custom logic here to generate a unique chat room ID.
    // For example, you can sort the user IDs and concatenate them to form the chat room ID.
    return [userId1, userId2].sort().join("_");
  };


  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const socket = io("http://localhost:8000", {
    withCredentials: true,
  });

  useEffect(() => {
    // Listen for incoming chat messages from the server
    socket.on('chat message', handleIncomingMessage);
  
    return () => {
      // Clean up the socket event listener when the component unmounts
      socket.off('chat message', handleIncomingMessage);
    };
  }, [socket]);

  useEffect(() => {
    socket.on("chat message", handleIncomingMessage);

    // Fetch registered users from the backend API
    axios
      .get("http://localhost:8000/api/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching registered users:", error);
      });
  }, []);

  // const fetchChatRoomMembers = async () => {
  //   try {
  //     const response = await axios.post("http://localhost:8000/api/chat-members");
  //     setChatMembers(response.data);
  //   } catch (error) {
  //     console.error("Error fetching chat room members:", error);
  //   }
  // };

  const handleIncomingMessage = (data) => {
    const { chatRoomId, message } = data;
    // Check if the incoming message belongs to the current chat room or user
    if (selectedChat && selectedChat._id === chatRoomId) {
      // For group chat, check if the selectedChat._id matches the chatRoomId
      // For one-on-one chat, you can check if the selectedUser._id matches the chatRoomId
      setUserChatMessages((prevMessages) => [...prevMessages, message]);
    }
  };

  const handleChatSelect = async (user) => {
    setSelectedUser(user);
    setSelectedChat(null);
    setChatWindowOpen(true);
  
    try {
      // Fetch or create the chat room identifier based on the selected user
      const chatRoomId = getChatRoomId(currentUser.id, user._id);
  
      // Fetch chat messages for the selected chat room
      const response = await axios.get(`http://localhost:8000/api/chat-messages/${chatRoomId}`);
      setUserChatMessages(response.data);
  
      // Join the chat room on the server side
      socket.emit('joinChatRoom', chatRoomId);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  const fetchChatMessages = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/chat-messages/${id}`
      );
      setChatMessages(response.data);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const sendChatMessage = async () => {
    if (selectedUser && message.trim() !== '') {
      try {
        // Send the message to the backend along with the receiver's ID
        await axios.post('http://localhost:8000/api/chat-messages', {
          sender: currentUser.id,
          receiver: selectedUser._id,
          message: message,
        });
  
        // Clear the message input field
        setMessage('');
      } catch (error) {
        console.error('Error sending chat message:', error);
      }
    }
  };

  const handleGoBack = () => {
    setSelectedChat(null);
    setSelectedUser(null);
    setChatWindowOpen(false); // Close the chat window
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Left Sidebar */}
      {!isSmallScreen && (
        <Box
          sx={{ width: "25%", height: "100vh", borderRight: "1px solid #ccc" }}
        >
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6">Chat Members</Typography>
            </Toolbar>
          </AppBar>
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search chat members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <List>
            {users
              .filter((user) =>
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((user) => (
                <ListItem
                  key={user._id}
                  button
                  selected={selectedChat?.id === user._id}
                  onClick={() => handleChatSelect(user)}
                >
                  <ListItemAvatar>
                    <Avatar src={user.avatar} />{" "}
                    {/* Use the user's avatar URL */}
                  </ListItemAvatar>
                  <ListItemText primary={user.email} />
                </ListItem>
              ))}
          </List>
        </Box>
      )}

      {/* Right Section */}
      <Box
        sx={{
          flexGrow: 1,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top Bar */}
        <AppBar position="static">
          <Toolbar>
          {isSmallScreen && selectedChat ? (
              // Show back button in smaller screen when a chat is selected
              <IconButton color="inherit" onClick={handleGoBack}>
                <ArrowBackIcon />
              </IconButton>
            ) : (
              <>
                {selectedChat || selectedUser ? (
                  // Show avatar and chat name if a chat is selected
                  <ListItemAvatar>
                    <Avatar>
                      {selectedChat?.avatar || selectedUser?.avatar || "?"}
                    </Avatar>
                  </ListItemAvatar>
                ) : (
                  // Show "Select a Chat" if no chat is selected
                  <Typography variant="h6">Select a Chat</Typography>
                )}
                <Typography sx={{ marginLeft: "10px" }} variant="h6">
                  {selectedUser ? `${selectedUser.email}` : ""}
                </Typography>
              </>
            )}
          </Toolbar>
        </AppBar>

        {/* Chat Members Search */}
        {isSmallScreen && !selectedChat && !chatWindowOpen && (
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search chat members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}

        {/* Chat Members List */}
        {!selectedChat && isSmallScreen && !chatWindowOpen && (
          <List>
            {users
              .filter((user) =>
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((user) => (
                <ListItem
                  key={user._id}
                  button
                  selected={selectedChat?.id === user._id}
                  onClick={() => handleChatSelect(user)}
                >
                   <ListItemAvatar>
                    <Avatar src={user.avatar} />
                  </ListItemAvatar>
                  <ListItemText primary={user.email} />
                </ListItem>
              ))}
          </List>
        )}

        {/* Chat Messages */}
        {selectedChat || (selectedUser && !isSmallScreen) ? (
          <Box
            sx={{
              flexGrow: 1,
              padding: "1rem",
              overflowY: "auto",
              backgroundColor: "#f7f7f7",
            }}
          >
            {isSmallScreen && (
              <Typography variant="h6" align="center" mb={2}>
                Chat with {selectedChat.name}
              </Typography>
            )}

            {userChatMessages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    message.sender === "me" ? "flex-end" : "flex-start",
                  mb: "0.5rem",
                }}
              >
                <Box
                  sx={{
                    background: message.sender === "me" ? "#DCF8C6" : "#FFFFFF",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    textAlign: message.sender === "me" ? "right" : "left",
                    maxWidth: "70%",
                  }}
                >
                  {message.text}
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="body1">
              Select a chat member to start chatting.
            </Typography>
          </Box>
        )}

        {/* Message Input and Send Button */}
        {selectedChat || selectedUser ? (
          // Show the chat input area if a chat member or user is selected
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton color="primary" onClick={sendChatMessage}>
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        ) : null}
      </Box>
      
    </Box>
  );
};

export default ChatApp;
