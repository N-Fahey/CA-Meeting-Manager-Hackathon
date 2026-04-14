FROM node:25-alpine3.22

# Configurable arguments
ARG HOST=0.0.0.0
ARG PORT=3000

WORKDIR /app

# Install dependencies
COPY package*.json .
RUN npm install

# Copy app
COPY src/ .

# Default environment
ENV HOST=${HOST}
ENV PORT=${PORT}

EXPOSE ${PORT}

CMD ["node", "server.js"]