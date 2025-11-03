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
                        dockerImage.push('latest')
                    }
                }
            }
        }

        stage('Deploy Blue-Green') {
            steps {
                script {
                    // Check if node_blue is running
                    def active = sh(
                        returnStdout: true,
                        script: 'docker ps --filter "name=node_blue" --format "{{.Names}}" || true'
                    ).trim()

                    // Decide next color and port
                    def nextColor = active == "node_blue" ? "green" : "blue"
                    def nextPort = nextColor == "blue" ? "9091" : "9092"

                    echo "Deploying ${nextColor} container on port ${nextPort}"

                    // Stop and remove previous inactive container if any
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
