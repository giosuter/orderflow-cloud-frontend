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
        // Show timestamps in the console output
        timestamps()
        // Use ANSI colors in the log (if the plugin is installed)
        ansiColor('xterm')
    }

    stages {
        stage('Checkout') {
            steps {
                // In a "Pipeline script from SCM" job, Jenkins already checks out the code,
                // but this is harmless and keeps the stage visible.
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
                // Same as your local command: opens Firefox, runs tests once, then exits
                sh 'npm test -- --watch=false'
            }
        }

        stage('Build production bundle') {
            steps {
                // Uses the local Angular CLI via npm script
                sh 'npm run build -- --configuration production --base-href /orderflow-cloud/'
            }
        }

        stage('Archive build artifacts') {
            steps {
                // Store the built Angular files as Jenkins artifacts
                archiveArtifacts artifacts: 'dist/orderflow-cloud-frontend/**', fingerprint: true
            }
        }
    }
}