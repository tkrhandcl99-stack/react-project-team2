import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3',
      prompt: `당신은 한국어로만 대답하는 맛집 추천 AI 어시스턴트입니다. 반드시 한국어로만 답변해주세요.\n\n사용자 질문: ${message}`,
      stream: false,
    }),
  });

  const data = await response.json();
  res.json({ reply: data.response });
});

app.listen(3001, () => console.log('서버 실행 중 http://localhost:3001'));
