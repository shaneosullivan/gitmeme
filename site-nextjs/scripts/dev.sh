npm run startDev

on_termination() {
    # Add your cleanup script or command here
    echo "cleaning up dev environment"
    npm run cleanupDev    
}

# Set up the trap to call on_termination() when a SIGTERM signal is received
trap on_termination SIGINT
trap on_termination SIGTERM
trap on_termination EXIT

npm run nextdev
