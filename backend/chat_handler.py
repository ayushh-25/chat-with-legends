from google import genai
from decouple import config

class ChatHandler:
    def __init__(self):
        self.client = genai.Client(api_key=config('GENAI_API_KEY'))
        
    def generate_response(self, user_input, chat_history):  
        response = self.client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[
                "You are a helpful mentor. Answer the user's question in the best way possible. You can use the provided chat history to help you answer the question.",
                "User input: " + user_input, 
                "Chat history: " + str(chat_history)
            ],
            config={
                "temperature": 0.7,
                "max_output_tokens": 500
            }
        )
        
        return response.text
        