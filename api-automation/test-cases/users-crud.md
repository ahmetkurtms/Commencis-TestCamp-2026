# Contact List — kullanıcı akışı

1. `POST /users` — kayıt; 201, gövdede `token` ve `user`.  
2. `GET /contacts` — Bearer ile; 200, dizi.  
3. `GET /users/me` — Bearer ile; kayıt bilgileri.  
4. `PATCH /users/me` — rastgele `firstName` / `lastName`, yeni e-posta, aynı `password`.  
5. `GET /users/me` — güncel alanlar.  
6. `DELETE /users/me`.  
7. `GET /users/me` — **401**.

Postman: https://documenter.getpostman.com/view/4012288/TzK2bEa8  

Test: `tests/users-crud.spec.ts`. Yerel mock: `USE_LOCAL_MOCK=1` veya `npm run test:local`.
