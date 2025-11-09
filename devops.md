# Job Tracking Application — CI/CD Setup & Runbook

**Purpose:** set up automatic builds when code is pushed to GitHub → Jenkins builds the frontend, creates a Docker image, pushes it to Docker Hub, and runs the container on the Jenkins host.

---

## 1) Repo & branches (what we used)

* GitHub repo: `https://github.com/Job-Tracking-Application/frontend-app`
* Branches used: `develop` (primary CI test), `main` (production)
* Multibranch Pipeline job in Jenkins: `frontend-app-pipeline`
---

## 2) Local / server prerequisites (install on Jenkins host)

Install these on the machine where Jenkins runs:

* Docker Engine (and add `jenkins` user to `docker` group)
* Git
* Jenkins (with plugins listed below)
* ngrok (optional, for exposing your local Jenkins to GitHub webhook during dev)

Commands (Ubuntu example):

```bash
# Docker
sudo apt update
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/docker.gpg
sudo add-apt-repository "deb [arch=$(dpkg --print-architecture)] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io
sudo usermod -aG docker jenkins
sudo systemctl restart docker
sudo systemctl restart jenkins
# Git
sudo apt install -y git
```
---

## 3) Jenkins plugins required

Install via **Manage Jenkins → Plugins**:

* Docker Pipeline
* Docker Plugin
* Git Plugin
* GitHub Plugin
* GitHub Branch Source
* Pipeline: Groovy
* Credentials (and credential providers you need)

---

## 4) Credentials in Jenkins

Create credentials in **Manage Jenkins → Credentials → (global)**:

1. **GitHub Personal Access Token (PAT)**

   * Kind: *Username with password*
   * Username: your GitHub username (e.g. `bhosalevivek04`)
   * Password: PAT (scopes: `repo`, `admin:repo_hook`, `workflow`)
   * ID: e.g. `github-https` or `github-token`

2. **DockerHub credentials** (for pushing images)

   * Kind: *Username with password*
   * Username: DockerHub username
   * Password: DockerHub personal access token (or password)
   * ID: e.g. `dockerhub-credentials`

(If you prefer SSH: you can add **SSH Username with private key** credential and use it in non-GitHub sources.)

---

## 5) Configure GitHub Server in Jenkins (so hooks are managed)

**Manage Jenkins → Configure System → GitHub Servers**

* Name: `github.com`
* API URL: `https://api.github.com`
* Credentials: select the PAT credential you created
* **Enable “Manage hooks”** (tick) → ensures Jenkins can automatically create webhooks in your repo
* Test Connection → should succeed

---

## 6) Multibranch Pipeline setup (Jenkins job)

Create a **Multibranch Pipeline** item named `frontend-app-pipeline`.

**Branch Sources**:

* Add **GitHub** source (not plain Git)

  * Credentials: choose your GitHub PAT credential
  * Repository HTTPS URL: `https://github.com/Job-Tracking-Application/frontend-app.git`
  * Owner: (auto) or `Job-Tracking-Application`
  * Repository: `frontend-app`
* Behaviours:

  * Discover branches: *Discover all branches* (or include only `develop, main`)
  * Discover pull requests from origin: choose merge strategy if you want PR builds
* Save

**Scan Multibranch Pipeline Triggers**:

* You do not need the old “Build Triggers” checkbox (multibranch uses branch source webhooks). Ensure GitHub integration and Manage Hooks are on.

---

## 7) Webhook configuration (GitHub side)

If Jenkins `Manage hooks` is enabled, Jenkins will create the webhook automatically. If you prefer to add manually (common with ngrok dev):

* Payload URL: `https://<ngrok-domain>/github-webhook/`
  (e.g. `https://abc123.ngrok-free.app/github-webhook/`)
* Content type: `application/json`
* Events: choose *push* (and optionally PR events)
* Save

Verify Recent Deliveries show `200 OK`. If you see 404 — re-check URL and Jenkins GitHub server config.

---

## 8) Jenkinsfile (final used pipeline)

Place this `Jenkinsfile` at repository root (we used `develop` branch):

```groovy
pipeline {
    agent none

    environment {
        DOCKERHUB_REPO = "bhosalevivek04/jobtracking_frontend"   // <--- your Docker Hub repo
    }

    stages {
        stage('Build Project') {
            agent {
                docker {
                    image 'node:20-alpine'
                    args '--user root -p 3000:3000' // change host port if conflict
                }
            }
            steps {
                checkout scm
                echo "Installing dependencies and building project..."
                sh 'npm ci --unsafe-perm --no-audit --cache .npm-cache'
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            agent any   // run on Jenkins host where Docker is installed
            steps {
                script {
                    def imageTag = "${DOCKERHUB_REPO}:${BUILD_NUMBER}"
                    sh "docker build -t ${imageTag} ."
                }
            }
        }

        stage('Push to Docker Hub') {
            agent any
            steps {
                script {
                    def imageTag = "${DOCKERHUB_REPO}:${BUILD_NUMBER}"
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                        sh "docker push ${imageTag}"
                    }
                }
            }
        }

        stage('Deploy Container') {
            agent any
            steps {
                script {
                    def imageTag = "${DOCKERHUB_REPO}:${BUILD_NUMBER}"
                    sh 'docker stop frontend-container || true'
                    sh 'docker rm frontend-container || true'
                    sh "docker run -d -p 3000:80 --name frontend-container ${imageTag}"
                }
            }
        }
    }

    post {
        success { echo '✅ Build, Push & Deploy successful!' }
        failure { echo '❌ Build failed. Check logs!' }
    }
}
```
**Notes**

* We run `npm` inside a `node:20-alpine` container and then run Docker build/push on host (so host Docker client is used).
* If port 3000 is already used on host, change `-p 3000:3000` to another host port (e.g. `-p 3001:3000`) **in Jenkinsfile** for the Docker agent to avoid conflicts.

---

## 9) Dockerfile (final)

Place `Dockerfile` in repository root:

```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

मराठीत: Multi-stage Dockerfile — build with Node 20, serve with nginx.

---

## 10) ngrok (for local development webhook)

If Jenkins runs locally behind NAT, you used ngrok to expose Jenkins.

Commands:

```bash
# start ngrok (example: expose port 8080 where Jenkins web UI listens)
ngrok http 8080
# copy https://xxxx.ngrok-free.dev and use it as webhook base:
https://xxxx.ngrok-free.dev/github-webhook/
```

* Free ngrok domains change each run — you can either allow Jenkins to manage hooks (when reachable) or update GitHub webhook each time domain changes.
* If you use a free plan you must update webhook if ngrok restarts.

---

## 11) Verification & test steps (how to test automatic build)

1. Make a tiny change (e.g. `README.md` or a comment in `src/App.jsx`) and commit:

```bash
git add .
git commit -m "test: webhook trigger"
git push origin develop
```

2. Check GitHub → Settings → Webhooks → Recent Deliveries → should show `200 OK`.
3. Jenkins → `frontend-app-pipeline` → should show “Started by GitHub push by <you>”.
4. Console Output should show stages: checkout → npm ci → npm run build → docker build → docker push → docker run.
5. Confirm Docker container is running:

```bash
docker ps
# look for container name: frontend-container and image bhosalevivek04/jobtracking_frontend:<build-number>
```

6. Open `http://<your-host-ip>:3000` → should show app.

---

## 12) Common troubleshooting (logs & fixes)

* **404 on webhook**: webhook path wrong or ngrok domain changed. Verify webhook URL is `https://<domain>/github-webhook/`. Ensure Jenkins GitHub Server has `Manage hooks` enabled.
* **404 or 403 when Jenkins polls GitHub**: PAT invalid or missing scopes. Recreate PAT with `repo` and `admin:repo_hook`.
* **`npm: not found`**: Node not available; fixed by running npm in Docker agent or installing Node on host.
* **`EACCES` in npm**: add `--unsafe-perm --cache .npm-cache` or run container as user root. We used root user inside node container.
* **`Vite requires Node 20+`**: Use `node:20-alpine` in Dockerfile and Jenkins node agent (we changed to node:20).
* **`docker: not found` inside node container**: docker CLI not present in Node container; we run docker build/push on host (`agent any`) so host docker is used.
* **Port already allocated (Bind for 0.0.0.0:3000 failed)**: stop existing container or change host port mapping inside Jenkinsfile for the agent or final run command.
* **Jenkins cannot access Docker**: ensure `jenkins` user is in `docker` group:

  ```bash
  sudo usermod -aG docker jenkins
  sudo systemctl restart jenkins
  ```
* **Branch indexing fails**: check GitHub Branch Source credentials and permissions.

---

## 13) Checklist for each teammate (quick start)

1. Clone the repo: `git clone git@github.com:Job-Tracking-Application/frontend-app.git`
2. Make changes on a feature branch, open PR or push to `develop`.
3. After push, Jenkins should auto-run. Check Jenkins UI -> pipeline logs.
4. If webhook fails, check GitHub → Settings → Webhooks → Recent Deliveries.
5. If Jenkins fails to build: attach console log to the team chat and tag lead.
---

## 14) Optional improvements (next steps)

* Add notifications (Slack / email) using Jenkins post actions or plugins.
* Use Docker image tags like `:latest`, semantic tags or Git SHA.
* Add environment-specific deploy stages (staging/prod) and Kubernetes deployment (future).
* Add unit tests, lint stage before docker build.
* Protect main branch with required PR reviews in GitHub (you saw rules earlier).
* Add `Jenkinsfile` library if multiple repos will share pipeline stages.
---

## 15) Files to commit to repo (summary)

* `Jenkinsfile` (root) — final pipeline we used
* `Dockerfile` (root) — multi-stage build
* `.dockerignore` (optional; exclude node_modules, .git)
* README (this document or trimmed version)

---

## 16) Ready-to-copy commands (common ones)

```bash
# test push
git add README.md
git commit -m "ci: test webhook"
git push origin develop

# check docker containers
docker ps

# stop container if port conflict
docker stop frontend-container || true
docker rm frontend-container || true

# prune (be careful - removes stopped containers)
docker container prune -f
docker network prune -f
```