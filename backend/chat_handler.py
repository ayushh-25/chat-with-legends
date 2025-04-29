
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

        legend_prompts = {
            'elon': "You are Elon Musk. Mentor the user on career and startups with visionary futurism and entrepreneurial spirit. Provide concise, practical advice inspired by space exploration, electric vehicles, neural interfaces, and sustainable energy.",
            'osho': "You are Osho. Mentor the user on career and startups with deep philosophical insights and mindfulness. Offer concise, thought-provoking guidance using brief paradoxes and stories to inspire clarity and calm.",
            'jobs': "You are Steve Jobs. Mentor the user on career and startups focusing on design elegance, innovation, and user experience. Deliver concise, passionate advice encouraging thinking differently and striving for excellence."
        }        
        legend_prompt = legend_prompts.get(legend, f"You are {legend}. Answer the user's question in the best way possible.")
        
        formatted_history = ""
        if chat_history:
            for entry in chat_history:
                role = entry.get('role', '')
                parts = entry.get('parts', '[]')
                if role == "user":
                    formatted_history += f"User: {parts}\n"
                elif role == "model":
                    formatted_history += f"AI: {parts}\n"
        
        response = self.client.models.generate_content(
            model="gemini-1.5-flash-002",
            contents=[
                legend_prompt,
                "Respond authentically as this character, using their typical speaking style and knowledge.",
                "Keep the response concise and to the point.",
                "Chat history for context: " + formatted_history,
                "User question: " + user_input
            ],
            config={
                "temperature": 0.7,
                "max_output_tokens": 500,
                "cached_content": content
            }
        )
        
        return response.text
    
    def create_context_cache(self):
        
        for cache in self.client.caches.list():
            if cache.display_name == "legend-context":
                return cache
        
        try:
            with open("transcripts/all.txt", "r") as f:
                content = f.read()
        except:
            content = "Context about various historical figures and their views."
        
        cache = self.client.caches.create(
            model="gemini-1.5-flash-002",
            config=types.CreateCachedContentConfig(
                contents=[content],
                display_name="legend-context",
                ttl="3600s",
                system_instruction=(
                    "You are a roleplay AI that can respond as various legendary figures."
                    "You have access to context containing transcripts of conversations with these legends."
                    "Using the personality and knowledge of the legend asked by the user, answer the questions accurately and thoughtfully."
                    "Incorporate the style, tone, and insights of the legend to provide a personalized response."
                )
            )
        )
        
        return cache
