Sample Compose:

```
services:
  frontend:
    build: 
      context: frontend/
      args:
        - VITE_BACKEND_URL=http://localhost:3001 # Backend URL
    ports:
      - 3000:80
    stdin_open: true # docker run -i
    tty: true        # docker run -t
  backend:
    build: ./backend/
    ports:
      - 3001:3333
```