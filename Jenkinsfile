// Jenkinsfile (frontend CI + CD for OrderFlow Cloud)
//
// Pipeline goals:
//  - Clone orderflow-cloud-frontend repo
//  - Install Node dependencies with `npm ci`
//  - Run Angular unit tests in HEADLESS Firefox
//  - Build Angular app for production (base href /orderflow-cloud/)
//  - Archive dist/ as build artifact
//  - Deploy to Hostpoint by calling deploy_orderflow_frontend_prod.sh
//
// Notes / Assumptions:
//  - Jenkins has Node.js + npm installed and available on PATH.
//  - Jenkins has Firefox installed (headless OK).
//  - Workspace is a clean clone of the GitHub repo.

pipeline {
    agent any

    environment {
        // Make sure Jenkins can find `node` and `npm` from NVM
        PATH = "/Users/giovannisuter/.nvm/versions/node/v22.20.0/bin:${PATH}"
    }

    options {
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
                sh 'npm ci'
            }
        }

        stage('Run unit tests') {
            steps {
                // Headless in CI
                sh 'npm test -- --watch=false --browsers FirefoxHeadless'
            }
        }

        stage('Build production bundle') {
            steps {
                sh 'npm run build -- --configuration production --base-href /orderflow-cloud/'
            }
        }

        stage('Archive build artifacts') {
            steps {
                archiveArtifacts artifacts: 'dist/orderflow-cloud-frontend/**', fingerprint: true
            }
        }

        stage('Deploy to Hostpoint') {
            // IMPORTANT: no "when { branch 'main' }" here, so it always runs
            steps {
                echo "Running deploy_orderflow_frontend_prod.sh from Jenkins workspace..."
                sh 'pwd'
                sh 'ls -ltra'
                sh 'chmod +x ./deploy_orderflow_frontend_prod.sh'
                sh './deploy_orderflow_frontend_prod.sh'
            }
        }
    }
}