# Obojobo 3 Server

About this project.

## Requirements

## Production Setup

## Administration

## Development and Testing

Check out the package.json for scripts the available commands


## Watching aws logs

1. Install https://github.com/jorgebastida/awslogs on your machine
2. Search for a list of log groups you can read: `awslogs groups`
3. Learn about awslogs using `awslogs --help`

Replace `GROUPNAME` with whatever group you wish to read
* Logs from the last day: `awslogs get GROUPNAME --start='1d ago'`
* Watch logs: `awslogs get GROUPNAME --watch`
