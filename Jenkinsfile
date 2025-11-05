pipeline {
  agent any
  stages {
    stage('Init') {
      steps {
        echo "OrderFlow Frontend — Phase 0 scaffolding OK"
        sh 'pwd && ls -la'
      }
    }
  }
  post {
    always {
      echo "Pipeline finished (Phase 0 placeholder)."
    }
  }
}
