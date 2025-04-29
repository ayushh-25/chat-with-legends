
import json
from model import Model
from chat_handler import ChatHandler

class Controller:
    def __init__(self):
        self.chat_handler = ChatHandler()
        self.model = Model()
    
    def handle_chat(self, request):
        try:
            user_input = request.form.get('user_input')
            session_id = request.form.get('session_id')
            legend = request.form.get('legend')
    
            chat_history = self.model.get_chat_history(session_id)
            
            if not chat_history:
                chat_history = []                       
            
            parts = json.dumps([
                {
                    "text": user_input
                }
            ])
            
            self.model.insert_chat(session_id, legend, "user", parts)
            
            response = self.chat_handler.generate_response(user_input, chat_history, legend)
            
            parts = json.dumps([
                {
                    "text": response
                }
            ])
            
            self.model.insert_chat(session_id, legend, "model", parts)
            
            return {
                "status_code": 1,
                "message": "success",
                "response": response
            }
            
        except Exception as e:
            print(f"Error in handle_chat: {str(e)}")
            return {
                "status_code": 0,
                "message": str(e),
                "response": None
            }
