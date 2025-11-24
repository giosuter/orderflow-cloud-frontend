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

    options {
        // Stop very long builds
        timeout(time: 30, unit: 'MINUTES')
    }

    environment {
        // Adjust if you use a Node tool in Jenkins (e.g. with NodeJS plugin)
        // PATH = "${tool 'node18'}/bin:${env.PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                // For a multibranch pipeline, Jenkins will manage the checkout.
                // For a classic pipeline job, you can add:
                // checkout scm
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                echo 'Running npm ci...'
                sh 'npm ci'
            }
        }

        stage('Run unit tests (headless)') {
            steps {
                echo 'Running Angular tests in headless Firefox...'
                // Use FirefoxHeadless defined in karma.conf.cjs
                sh 'npx ng test --watch=false --browsers=FirefoxHeadless --progress=false'
            }
        }

        stage('Build Angular app (production)') {
            steps {
                echo 'Building Angular app for production with base-href /orderflow-cloud/...'
                sh 'npx ng build --configuration production --base-href=/orderflow-cloud/'
            }
        }

        stage('Archive dist') {
            steps {
                echo 'Archiving dist/orderflow-cloud-frontend...'
                archiveArtifacts artifacts: 'dist/orderflow-cloud-frontend/**', fingerprint: true
            }
        }
    }

    post {
        always {
            junit 'coverage/**/*.xml' // optional, only if you later add JUnit-style reports
        }
        success {
            echo 'Frontend pipeline completed successfully.'
        }
        failure {
            echo 'Frontend pipeline FAILED. Please check the console output.'
        }
    }
}