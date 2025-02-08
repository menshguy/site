import os
import requests
from dotenv import load_dotenv
from openai import OpenAI
from flask import Flask, jsonify, request
from flask_cors import CORS
app = Flask(__name__)

load_dotenv(override=True)
api_key = os.getenv('OPENAI_API_KEY')

headers = {
 "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
}

MODEL = 'gpt-4o-mini'
openai = OpenAI()
    
system_prompt = "You are a chatbot acting on behalf of me. All of your messages should be written as me. Your job is to answer questions \
from the user about me using your knowledge of me. Your responses should be short and to the point. \
Respond in casual language. Don't make any jokes cause you suck at that."

def user_prompt_for(user_input):
  user_prompt = f"You have received the following question from the user about me: {user_input}. Answer the question."
  return user_prompt

def messages_for(user_input):
  return [
    {"role": "system", "content": system_prompt},
    {"role": "user", "content": user_prompt_for(user_input)}
  ]

# OPEN AI
def bot_response(user_input):
  response = openai.chat.completions.create(
      model = MODEL,
      messages = messages_for(user_input)
  )
  return response.choices[0].message.content

@app.route('/api/bot', methods=['GET'])
def response():
    default_response = 'Tell me about Jeff' # default message if none provided
    user_message = request.args.get('message', default_response)  
    response = bot_response(user_message)
    return jsonify({"message": response})


if __name__ == '__main__':
  app.run(port=5328)