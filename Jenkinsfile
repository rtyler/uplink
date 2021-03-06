pipeline {
    agent { label 'linux' }

    options {
        timeout(time: 1, unit: 'HOURS')
        buildDiscarder(logRotator(daysToKeepStr: '10'))
        timestamps()
    }

    triggers {
        pollSCM('H * * * *')
    }

    stages { 
        stage('Build & test') {
            steps {
                sh 'make migrate check'
            }
        }

        stage('Containers') {
            steps {
                sh 'make container'
            }
        }

        stage('Publish container') {
            when { expression { infra.isTrusted() } }

            steps {
                withCredentials([[$class: 'ZipFileBinding',
                            credentialsId: 'jenkins-dockerhub',
                                variable: 'DOCKER_CONFIG']]) {
                    sh 'make publish'
                }
            }
        }
    }
}

// vim: ft=groovy
