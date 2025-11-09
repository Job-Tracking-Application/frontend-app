pipeline {
    agent any

    environment {
        DOCKERHUB_REPO = "vivekbhosale04/jobtracking-frontend" // change this to your actual Docker Hub repo
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
                sh 'npm ci'
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def imageTag = "${DOCKERHUB_REPO}:${BUILD_NUMBER}"
                    echo "Building Docker image ${imageTag}"
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
