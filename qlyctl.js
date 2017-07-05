#!/usr/bin/env node

const exec = require('child_process').exec;

function main (argv) {
  if (argv.length < 3) {
    return console.info("Please...provide a valid option... run 'qlyctl help' for a list of available options")
  }

  const cmd = argv[ 2 ]

  switch (cmd) {
    case 'build':
      return run_build(argv.slice(3))

    case 'test':
      return run_test(argv.slice(3))
  }
  return console.info("Please...provide a valid option... run 'qlyctl help' for a list of available options")
}

function run_build (argv) {
  var env = argv[ 0 ] || 'dev'
  switch (env) {
    case 'development':
    default:
      console.info('Building development...')
      exec('docker-compose build', (error, stdout) => {
        if (error) {
          console.error(error);
          return;
        }
        console.log(stdout);
      })
  }
}

function run_test (argv) {
  if (argv.indexOf('--keep') !== 1) {
    exec('clear')
  }

  console.info('Running test on quanly-dev-server')
  run_in_service_container('server', 'npm test')
}

function run_in_service_container (service, command) {
  var pod = locate_pod(service)
  exec(`docker exec -t ${pod} ${command}`)
}

function copy_to_service_container (service, src, dst) {
  var pod = locate_pod(service)
  exec(`docker cp ${src} ${pod}:${dst}`)
}

function locate_pod (service) {
  return 'quanly-dev-' + service
}

main(process.argv)
