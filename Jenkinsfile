pipeline {
    agent any

    environment {
        // ✓ CORRECT: Jenkins finds npm and node from NVM
        PATH = "/Users/giovannisuter/.nvm/versions/node/v22.20.0/bin:${PATH}"
    }

    options {
        timestamps()      // ✓ make logs time-stamped
        ansiColor('xterm') // ✓ color output
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm   // ✓ correct
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm ci'    // ✓ correct: CI-friendly + fast
            }
        }

        stage('Run unit tests') {
            steps {
                // ✓ correct: overrides the default browser and singleRun
                sh 'npm test -- --watch=false --browsers FirefoxHeadless'
            }
        }

        stage('Build production bundle') {
            steps {
                // ✓ correct Angular build
                sh 'npm run build -- --configuration production --base-href /orderflow-cloud/'
            }
        }

        stage('Archive build artifacts') {
            steps {
                // ✓ perfectly correct artifact path
                archiveArtifacts artifacts: 'dist/orderflow-cloud-frontend/**', fingerprint: true
            }
        }

        stage('Deploy to Hostpoint') {
            when {
                branch 'main'     // ✓ only deploy from main
            }
            steps {
                // ✓ correct usage of your deploy script
                sh 'chmod +x ./deploy_orderflow_frontend_prod.sh'
                sh './deploy_orderflow_frontend_prod.sh'
            }
        }
    }
}