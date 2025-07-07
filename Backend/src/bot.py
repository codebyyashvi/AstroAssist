from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain.chat_models import init_chat_model
from langchain.schema import AIMessage
import os, json
from dotenv import load_dotenv

load_dotenv()

os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY")

class State(TypedDict):
    messages: Annotated[list, add_messages]

llm = init_chat_model("google_genai:gemini-2.0-flash")

def chatbot(state: State):
    result = llm.invoke(state["messages"])
    return {"messages": [result]}


graph_builder = StateGraph(State)
graph_builder.add_node("chatbot", chatbot)

graph_builder.add_edge(START, "chatbot")
graph_builder.add_edge("chatbot", END)

graph = graph_builder.compile()

# Get the current script directory
current_dir = os.path.dirname(__file__)
# print(current_dir)

# Build the correct relative path to the prompt file
prompt_path = os.path.join(current_dir, "system_prompt.txt")
faq_path = os.path.join(current_dir, "extract-faqs.json")

# Load system prompt
with open(prompt_path, "r", encoding="utf-8") as f:
    system_prompt = f.read()

# Load FAQs
with open(faq_path, "r", encoding="utf-8") as f:
    faqs = json.load(f)


# Format FAQs as plain text (Q&A style)
formatted_faqs = "\n\nFrequently Asked Questions (FAQs):\n"
for faq in faqs:
    formatted_faqs += f"\nQ: {faq['question']}\nA: {faq['answer']}\n"

# Combine the system prompt and the formatted FAQs
SYSTEM_PROMPT = system_prompt + formatted_faqs
# print(SYSTEM_PROMPT)


def get_response(user_query: str) -> str :
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_query}
    ]

    graph_response = graph.invoke( 
        {"messages": messages})

    ai_reply = next(
        (msg.content for msg in graph_response["messages"] if isinstance (msg, AIMessage)), "No AI response found"
    )
    
    return ai_reply