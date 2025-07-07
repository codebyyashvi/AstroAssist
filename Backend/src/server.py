from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Union
from bot import get_response
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or restrict to your frontend domain
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryInput(BaseModel):
    message: str

@app.post("/chat")
def chat(input: QueryInput):
    ai_res = get_response(input.message)
    return {"response": ai_res}