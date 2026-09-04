default:
    @just --list

# Compile the application packages.
compile:
    vp run build

# Lint the repository.
lint:
    vp run lint

# Run the development server.
server:
    vp run dev:server
