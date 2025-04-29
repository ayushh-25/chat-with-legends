
from flask import Flask
from route import route
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

app.register_blueprint(route)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3050, debug=True)
