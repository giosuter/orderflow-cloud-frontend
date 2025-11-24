// Jenkinsfile (frontend CI for OrderFlow Cloud)
//
// Pipeline goals:
//  - Clone orderflow-cloud-frontend repo
//  - Install Node dependencies with `npm ci`
//  - Run Angular unit tests in HEADLESS Firefox
//  - Build Angular app for production (base href /orderflow-cloud/)
//  - Archive dist/ as build artifact
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
            when {
                branch 'main'       // deploy only from main
            }
            steps {
                // Use your existing deployment script in the repo root
                sh 'chmod +x ./deploy_orderflow_frontend_prod.sh'
                sh './deploy_orderflow_frontend_prod.sh'
            }
        }
    }
}