pipeline {
    agent any

    environment {
        DOCKER_HUB = 'harshues04/node-bluegreen'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/harshues04/Blue-Green-Deployment.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("${DOCKER_HUB}:${env.BUILD_NUMBER}")
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub') {
                        dockerImage.push()
                    }
                }
            }
        }

        stage('Deploy Blue-Green') {
            steps {
                script {
                    // Detect which container is active
                    def active = sh(returnStdout: true, script: 'docker ps --filter "name=node_blue" --format "{{.Names}}"').trim()
                    def nextPort = active == "node_blue" ? "9092" : "9091"
                    def nextColor = active == "node_blue" ? "green" : "blue"

                    echo "Deploying ${nextColor} container on port ${nextPort}"

                    sh """
                        docker rm -f node_${nextColor} || true
                        docker run -d --name node_${nextColor} -p ${nextPort}:3000 ${DOCKER_HUB}:${env.BUILD_NUMBER}
                    """

                    echo "✅ ${nextColor} environment deployed successfully!"
                }
            }
        }
    }
}
