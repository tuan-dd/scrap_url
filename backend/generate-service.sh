#!/bin/bash

# Check if the required parameters are not provided
if [ $# -lt 4 ]; then
  echo "Usage: ./generate-service.sh -n name-service -t nest|go"
  exit 1
fi

# Initialize variables
SERVICE_NAME=""
SERVICE_TYPE=""

# Parse input parameters
while [[ "$#" -gt 0 ]]; do
  case $1 in
    -n)
      SERVICE_NAME="$2"  # Set the service name
      shift 2  # Move to the next argument
      ;;
    -t)
      SERVICE_TYPE="$2"  # Set the service type (either 'nest' or 'go')
      shift 2  # Move to the next argument
      ;;
    *)
      echo "Invalid argument: $1"  # Handle unknown arguments
      exit 1
      ;;
  esac
done

# Validate the service type
if [[ "$SERVICE_TYPE" != "nest" && "$SERVICE_TYPE" != "go" ]]; then
  echo "The -t value must be either 'nest' or 'go'"
  exit 1
fi

# Define the paths for the template and the target directory
TEMPLATE_DIR="./templates/$SERVICE_TYPE"
TARGET_DIR="./$SERVICE_NAME-service"



# Check if the specified template directory exists
if [ ! -d "$TEMPLATE_DIR" ]; then
  echo "Template $SERVICE_TYPE not found in $TEMPLATE_DIR"
  exit 1
fi


if [ "$SERVICE_TYPE" == "nest" ]; then
  if [ -d "$TEMPLATE_DIR/node_modules" ]; then
    rm -rf "$TEMPLATE_DIR/node_modules"
  fi
fi

# Copy the template directory and rename it to the new service name
cp -r "$TEMPLATE_DIR" "$TARGET_DIR"



# Confirm the creation of the new service
echo "Service '$SERVICE_NAME' has been created from the '$SERVICE_TYPE' template at '$TARGET_DIR'."
