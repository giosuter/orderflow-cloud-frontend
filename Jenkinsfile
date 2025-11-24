pipeline {
    agent any

    options {
        // Show timestamps and colors in the build log
        timestamps()
        ansiColor('xterm')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                // Use absolute path to npm so Jenkins can find it
                sh '/Users/giovannisuter/.nvm/versions/node/v22.20.0/bin/npm ci'
            }
        }

        stage('Run unit tests') {
            steps {
                // Same command as locally, just with absolute npm path
                sh '/Users/giovannisuter/.nvm/versions/node/v22.20.0/bin/npm test -- --watch=false'
            }
        }

        stage('Build production bundle') {
            steps {
                // Build for production with correct base href
                sh '/Users/giovannisuter/.nvm/versions/node/v22.20.0/bin/npm run build -- --configuration production --base-href /orderflow-cloud/'
            }
        }

        stage('Archive build artifacts') {
            steps {
                archiveArtifacts artifacts: 'dist/orderflow-cloud-frontend/**', fingerprint: true
            }
        }
    }
}