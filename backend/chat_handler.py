from google import genai
from decouple import config
from google.genai import types

class ChatHandler:
    def __init__(self):
        self.client = genai.Client(api_key=config('GENAI_API_KEY'))
        self.content_cache = self.create_context_cache()
        
    def generate_response(self, user_input, chat_history, legend):
        
        if not self.client.caches.list():
            self.content_cache = self.create_context_cache()
        
        content = self.content_cache.name
        
        response = self.client.models.generate_content(
            model="gemini-1.5-flash-002",
            contents=[
                "You are a helpful mentor."
                "Answer the user's question in the best way possible as the given legend.",
                "You can use the provided chat history to help you answer the question.",
                "User input: " + user_input, 
                "Chat history: " + str(chat_history),
                "Legend: " + legend
            ],
            config={
                "temperature": 0.7,
                "max_output_tokens": 100,
                "cached_content": content
            }
        )
        
        return response.text
    
    def create_context_cache(self):
        
        for cache in self.client.caches.list():
            if cache.display_name == "legend-context":
                return cache
        
        with open("transcripts/all.txt", "r") as f:
            content = f.read()
        
        cache = self.client.caches.create(
            model="gemini-1.5-flash-002",
            config=types.CreateCachedContentConfig(
                contents=[content],
                display_name="legend-context",
                ttl="3600s",
                system_instruction=(
                    "You are a helpful mentor."
                    "You have access to a context containing a transcript of conversations with the legends."
                    "Using the personality and knowledge of the legend asked by the user, answer the user's question accurately and thoughtfully."
                    "Incorporate the style, tone, and insights of the legend to provide a personalized response."
                    "Use the provided context and user input to guide your answer."
                )
            )
        )
        
        return cache