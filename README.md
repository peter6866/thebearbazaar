# Semester-Project

## Team Name: <Insert Here>

## Group #: 10

## Contributors: <Insert Here>

## TA: Mutaz Badr

## Instructions/Link to access: [The Bear Bazaar](http://www.thebearbazaar.com)

# Starting the Project

## Prerequisites

- Docker desktop installed on your machine.

## Starting the Project

To start the project, you have two options depending on your needs:

### Option 1: Starting in Detached Mode

Use this option if you want to start the containers in the background:

```bash
docker-compose up -d
```

This command starts the containers in detached mode, allowing you to continue using the terminal while the containers run in the background.

### Option 2: Building or Rebuilding Containers

Use this option if you've made changes to the Dockerfiles or if you need to rebuild the images for any reason:

```bash
docker-compose up --build
```

This command rebuilds the images from the Dockerfiles and starts the containers. It's useful when updating dependencies or making significant changes to the container setup.

## Shutting down the Project

```bash
docker-compose down
```

## Note for Windows Users

### Enabling Hot Reload

If you are developing on Windows, it's essential to ensure hot reload works correctly. To enable efficient hot reloading, place your project directory within the WSL file system. For installing WSL, visit [https://learn.microsoft.com/en-us/windows/wsl/install].

Follow these steps:

1. Open your WSL2 terminal.
2. Navigate to a suitable directory within the WSL2 file system (/home/[user]).
3. Clone your project to this location.
4. Proceed with the Docker Compose commands as described above.
