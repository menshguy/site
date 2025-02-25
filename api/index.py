import os
import requests
from dotenv import load_dotenv
from openai import OpenAI
from flask import Flask, request, jsonify
from flask_cors import CORS
import glob
import json

app = Flask(__name__)

load_dotenv(override=True)
api_key = os.getenv('OPENAI_API_KEY')

print("API KEY IS GOOD: " + api_key)

headers = {
 "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
}

MODEL = 'gpt-4o-mini'
openai = OpenAI()

# Context / RAG
def load_rag_context():
    context = []
    text_files = glob.glob('./rag/*.txt')
    for file_path in text_files:
        try:
            with open(file_path, 'r') as file:
                content = file.read()
                context.append(f"Content from {file_path}: {content}")
        except Exception as e:
            print(f"Error reading {file_path}: {str(e)}")
    return "\n".join(context)

rag_context = load_rag_context()

# Prompts
system_prompt = "You are a chatbot acting on behalf of me. All of your messages should be written as me. Your job is to answer questions \
from the user about me using the context I will provide below."
system_prompt += "\n Relay any relevant links from my personal site(s) to the user."
system_prompt += "\n Your responses should be in casual language as if texting a friend (for example try to use contractions like can't instead of cannot. Use common text language like lol, haha, etc.). Do not make any jokes. Do not make anything up if you haven't been provided with relevant context."
system_prompt += "\n It is important that you answer any questions by using the context provided below."
system_prompt += "\n If you cannot find a suitable answer in the provided context, respond by indicating you are not sure how to answer. Do not reveal that you are a bot or ai."
system_prompt += "\n\n Below is the context about me (Jeff Fenster) that you must use to answer all questions: "
system_prompt += "\n <Context>"
system_prompt += "\n" + rag_context
system_prompt += "\n</Context>"

print("RAG CONTEXT:", system_prompt)

def user_prompt_for(user_input):
  print("User Input: " + user_input)
  print("System Prompt: " + system_prompt)
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

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/api/bot', methods=['GET'])
def response():
    default_response = 'Tell me about Jeff' # default message if none provided
    user_message = request.args.get('message', default_response)
    response = bot_response(user_message)
    print("Response: " + response)
    return jsonify({"message": response})

@app.route('/api/healthcheck', methods=['GET'])
def healthcheck():
    return jsonify({"status": "healthy"})

app.debug = True

# Vercel serverless handler
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)

# This is the handler that Vercel will use
app = app