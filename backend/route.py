from controller import Controller
from flask import request, jsonify, Blueprint

route = Blueprint('route', __name__)

controller = Controller()

@route.route("/chat", methods=["POST"])
def chat():
    response = controller.handle_chat(request)
    return jsonify(response)
