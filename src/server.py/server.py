from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 리액트와 연결을 허용하는 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProfileData(BaseModel):
    softness: int
    crunchyTexture: int
    moreSpicy: int
    moreSalty: int
    spices: int

@app.post("/api/tags")
async def get_tags(data: ProfileData):
    tags = []
    # 💡 여기서 태그 로직을 결정합니다.
    if data.moreSpicy >= 4: tags.append("#맵부심")
    if data.moreSalty >= 4: tags.append("#단짠단짠")
    if data.crunchyTexture >= 4: tags.append("#바삭왕")
    if not tags: tags = ["#미식탐험가"]
    
    return {"tags": tags[:3]}