from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain.chat_models import init_chat_model
from langchain.schema import AIMessage
import os
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

SYSTEM_PROMPT = """You are an AI-powered virtual assistant trained to help users find accurate and contextual information from the MOSDAC (Meteorological and Oceanographic Satellite Data Archival Centre) portal.

    Your purpose is to answer user queries related to satellite missions, data products, usage documentation, FAQs, and geospatial datasets available on the platform.

    Your responses should be:

    Accurate: Use information retrieved from official documents, FAQs, and metadata hosted on the MOSDAC portal.

    Contextual: Understand the user's intent and provide relevant, concise answers.

    Conversational: Maintain a helpful and polite tone, ask for clarification if needed, and support multi-turn conversations.

    Geospatial-Aware: If a query involves locations, timeframes, or regions (e.g., "data for Tamil Nadu floods in 2022"), consider geospatial metadata to return region-specific results.

    You are capable of understanding both technical and non-technical language.
    You must prefer structured, reliable sources (documents, FAQs, product catalogues) over generic summaries.

    When asked about a topic not available in the ingested MOSDAC content, politely inform the user that the requested information is currently not available.

    You are designed to help users navigate content faster, especially those who may find the MOSDAC interface complex or layered."""

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