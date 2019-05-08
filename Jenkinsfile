pipeline {
  agent {
    label "jenkins-monoci"
  }
  environment {
    ORG = 'jamescrabtree'
    APP_NAME = 'tacoboutaustin'
    CHARTMUSEUM_CREDS = credentials('jenkins-x-chartmuseum')
  }
  stages {
    stage('CI Build and push snapshot') {
      when {
        branch 'PR-*'
      }
      steps {
        container('monoci') {
          sh "mono-ci --test"
        }
      }
    }
    stage('Build Release') {
      when {
        branch 'master'
      }
      steps {
        container('monoci') {

          // ensure we're not on a detached head
          sh "git checkout master"
          sh "git config --global credential.helper store"
          sh "jx step git credentials"

          // so we can retrieve the version in later steps
          sh "mono-ci --test --upload"
        }
      }
    }
    stage('Promote to Environments') {
      when {
        branch 'master'
      }
      steps {
        container('monoci') {
          sh "python scripts/deploy.py"
        }
      }
    }
  }
  post {
        always {
          cleanWs()
        }
  }
}
