import {
  ChatContainer,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
// eslint-disable-next-line
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useLazyQuery } from "@apollo/client";
import { GET_USER } from "./graphql/queries";
import React, { useState } from "react";

export const ChatScreen = () => {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Swikruti! How Can I Help You!",
      sentTime: "just now",
      sender: "User",
    },
  ]);
  const [message] = useLazyQuery(GET_USER);
  const [isTyping, setIsTyping] = useState(false);

  const [selectedFile, setSelectedFile] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [inputBox, setInputBox] = useState(false);
  const [curText, setCurText] = useState("");
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(true);
    setSelectedFileName(file.name);
  };
  const handleUpload = async () => {
    await handleSend(selectedFileName);
    setSelectedFileName("");
    setInputBox(false);
    setSelectedFile(false);
  };

  const handleSend = async (m) => {
    const newMessage = {
      message: m,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    setIsTyping(true);
    await processMessageToLex(m);
  };

  async function processMessageToLex(chatMessages) {
    const newMessage = await message({
      variables: {
        sessionId: "id7",
        text: chatMessages,
      },
    });
    // console.log(
    //   newMessage.data?.chatBot.messages.map((item) => ({
    //     content: item.content,
    //   }))
    // );
    const contentType = await newMessage.data?.chatBot.messages.map((item) => ({
      contentType: item.contentType,
      content: item.content,
    }));
    setCurText(contentType[0].content);
    if (
      contentType[0]?.contentType === "ExcelType" ||
      contentType[0]?.contentType === "ImageType"
    ) {
      setInputBox(true);
    }
    // const newMessages = [...messages, newMessage];
    setMessages((prev) => [
      ...prev,
      ...newMessage.data?.chatBot.messages.map((item) => ({
        message: item.content,
        direction: "incoming",
        sender: "lex",
      })),
    ]);
    setIsTyping(false);
  }

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Poppins",
      }}
    >
      {inputBox ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            padding: "2px",
            justifyContent: "center",
            zIndex: 1,
            backgroundColor: "#0e5298",
            borderRadius: "10px",
            fontSmooth: "anti-aliasing",
            fontFamily: "sans-serif",
          }}
        >
          <input
            style={{
              borderRadius: "10px",
              padding: "5px",
              fontSize: "18px",
              marginTop: "2px",
            }}
            type="file"
            onChange={handleFileSelect}
            disabled={selectedFile}
            placeholder="hello"
          />

          <label
            style={{
              padding: "6px",
              color: "#ffffff",
              fontWeight: "bold",
            }}
          >
            {curText}
          </label>

          <button
            style={{
              backgroundColor: "black",
            }}
            disabled={selectedFile ? false : true}
            onClick={handleUpload}
          >
            Upload
          </button>
        </div>
      ) : (
        ""
      )}
      {/* <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          zIndex: 1,
          height: "8%",
          backgroundColor: "black",
          borderRadius: "10px",
        }}
      >
        <input
          type="file"
          onChange={handleFileSelect}
          disabled={selectedFile}
        />
        <button
          style={{
            backgroundColor: "black",
            fontWeight: "bold",
          }}
          disabled={selectedFile ? false : true}
          onClick={handleUpload}
        >
          Upload
        </button>
      </div> */}
      <MainContainer
        style={{
          zIndex: -1,
          height: "900px",
          width: "800px",
        }}
      >
        <ChatContainer>
          <MessageList
            scrollBehavior="smooth"
            typingIndicator={
              isTyping ? <TypingIndicator content="Lex is typing" /> : null
            }
          >
            {messages.map((message) => {
              console.log({ message });
              return <Message model={message} />;
            })}
          </MessageList>

          <MessageInput
            placeholder="Type message here"
            autoFocus
            onSend={handleSend}
            // onClick={<input title="Upload audio" />}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};
