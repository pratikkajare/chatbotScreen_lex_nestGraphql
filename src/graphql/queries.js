import { gql } from "apollo-boost";

export const GET_USER = gql`
  query ChatBot($sessionId: String, $text: String) {
    chatBot(SessionId: $sessionId, text: $text) {
      requestAttributes
      sessionId
      messages {
        content
        contentType
      }
      sessionState {
        dialogAction {
          type
          slotToElicit
        }
        intent {
          name
          slots
          state
          confirmationState
        }
        sessionAttributes
        originatingRequestId
      }
      interpretations {
        nluConfidence
      }
    }
  }
`;

export const CREATE_HIERARCHIE = gql`
  query ChatBot($sessionId: String, $text: String) {
    chatBot(SessionId: $sessionId, text: $text) {
      requestAttributes
      sessionId
      messages {
        content
        contentType
      }
      sessionState {
        dialogAction {
          type
          slotToElicit
        }
        intent {
          name
          slots
          state
          confirmationState
        }
        sessionAttributes
        originatingRequestId
      }
      interpretations {
        nluConfidence
      }
    }
  }
`;
