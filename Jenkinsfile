pipeline {
	agent none
	stages {
		stage('Build') {
			agent {
				docker {
					image 'node:8.9-alpine'
					args '-p 3000:3000'
				}
			}
			steps {
				sh 'npm install'
				sh 'npm run build'
			}
		}
	}
}
