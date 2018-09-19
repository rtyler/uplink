pipeline {
  agent { label 'linux' }
  stages { 
    stage('Build & test') {
      steps {
        sh 'make check'
      }
    }
  }
}
