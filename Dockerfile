# Stage 1: The Builder
# Use a Node.js image to build the app
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY nextjs-app/package*.json ./
RUN npm install

# Copy the rest of your application code
COPY nextjs-app/ .

# Build the Next.js application for production
# This requires the `output: 'standalone'` setting in next.config.js
RUN npm run build

# ---

# Stage 2: The Runner
# Use a minimal Node.js image for the final container
FROM node:20-alpine AS runner

WORKDIR /app

# Set the environment to production
ENV NODE_ENV production

# Copy the generated standalone folder from the builder stage
COPY --from=builder /app/.next/standalone ./

COPY --from=builder /app/.next/static ./.next/static

# Expose the port Next.js runs on
EXPOSE 3000

# The command to start the server
# The standalone output creates a server.js file for this purpose
CMD ["node", "server.js"]
