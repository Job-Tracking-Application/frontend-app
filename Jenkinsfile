pipeline {
    agent {
        docker {
            // Using Node 20 because your Vite and React packages require it
            image 'node:20-alpine'
            args '--user root -p 3000:3000'
        }
    }

    environment {
        // Your actual Docker Hub repo
        DOCKERHUB_REPO = "bhosalevivek04/jobtracking_frontend"
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Project') {
            steps {
                echo "Installing dependencies and building project..."
                // Fixes npm permission issue and uses local cache
                sh 'npm ci --unsafe-perm --no-audit --cache .npm-cache'
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def imageTag = "${DOCKERHUB_REPO}:${BUILD_NUMBER}"
                    sh "docker build -t ${imageTag} ."
                }
            }
        }

        stage('Push to Docker Hub') {
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
        success {
            echo '✅ Build, Push & Deploy successful!'
        }
        failure {
            echo '❌ Build failed. Check logs!'
        }
    }
}
