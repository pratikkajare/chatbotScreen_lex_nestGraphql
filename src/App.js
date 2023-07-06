import "./App.css";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "./graphql/apolloClient";
import { ChatScreen } from "./ChatScreen";

function App() {
  return (
    <div className="App">
      <ApolloProvider client={apolloClient}>
        <ChatScreen />
      </ApolloProvider>
    </div>
  );
}

export default App;
