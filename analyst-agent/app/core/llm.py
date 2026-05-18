from langchain.llms.base import LLM
from openai import OpenAI
from app.core.config import OPENAI_API_KEY, OPENAI_MODEL

client = OpenAI(api_key=OPENAI_API_KEY)

class OpenAILLM(LLM):
    @property
    def _llm_type(self) -> str:
        return "openai"

    def _call(self, prompt: str, stop=None) -> str:
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "You are an SRE assistant that produces concise, structured analysis.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.2,
        )
        return response.choices[0].message.content or ""

def get_llm():
    return OpenAILLM()
