import tensorflow as tf
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

app=Flask(__name__)

CORS(app,resources={r"/*": {"origins": "*"}})

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
chat_model = genai.GenerativeModel("gemini-2.5-flash")

chat_histories = {}


# Load the TFLite model
interpreter = tf.lite.Interpreter(model_path="mn_my_model.tflite")
interpreter.allocate_tensors()

# Define input and output details
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

@app.route('/',methods=['GET'])
def startServer():
    return "if you are seeing this, means server has started"

@app.route('/predict', methods=['POST'])
def successor():    
    f = request.files['file'] 
    f = f.read()  
    
    # Preprocess the image
    preprocessed_img = preprocess_img(f)

    # Run inference
    interpreter.set_tensor(input_details[0]['index'], preprocessed_img)
    interpreter.invoke()
    output_data = interpreter.get_tensor(output_details[0]['index'])
    try:
        num=float(output_data[0][0])
        result=True if (num>0.5) else False
    except ValueError:
        result=False
    return jsonify({'prediction': result})
    
def preprocess_img(img):

   img = tf.image.decode_image(img, channels=3)
   image = tf.image.resize(img,[256,256])
   imgArr = tf.keras.utils.img_to_array(image)/255.0
   imgReshape = np.expand_dims(imgArr, axis=0)

   return imgReshape


@app.route('/chat', methods=['POST'])
def chat_endpoint():
    data = request.json
    user_message = data.get("message", "")
    session_id = data.get("session_id", "default")
    
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    if session_id not in chat_histories:
        chat_histories[session_id] = []
        chat_histories[session_id].append({"role": "model", "parts": "You are a Polite, helpful assistant for medical inquiries integrated for the sake of patient motivation , help and you are only answerable related to pneumonia detection. If you are not sure about the answer ask the patient to consult doctor. If the question is out of context politely refuse to answer."})

    chat_histories[session_id].append({"role": "user", "parts": user_message})

    response = chat_model.generate_content(chat_histories[session_id])

    chat_histories[session_id].append({"role": "model", "parts": response.text})

    return jsonify({"reply": response.text, "history": chat_histories[session_id]})

#runs on default port 5000