pipeline {
  agent { label 'linux' }
  stages { 
    stage('Build & test') {
      steps {
        sh 'make check'
      }
    }

    stage('Containers') {
      steps {
        sh 'make container'
      }
    }

    stage('Publish container') {
        when {
            expression { infra.isTrusted() }
        }

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
