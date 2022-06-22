# NodeChatServer

---

JWT기반 인증 기능 (MONGO 연동)을 가지고 있는 실시간 채팅 백앤드 서버 입니다.

Tech Stack:
 - NodeJs
 - Koa (for web engine)
 - Passport (for authentication)
 - Socket.io (for websocket)
 - MongoDB (for Database)
 - Redis (for ChatLog, session, ...etc)
 - etc
---

구현 목표 :

- [x] JWT토큰을 이용한 유저 인증 기능 (Access토큰, Refresh토큰 분리)
- [ ] 친구목록, 상태매세지 기능
- [x] Sock.IO를 이용한 그룹 채팅 기능
- [ ] 이미지 전송 기능
