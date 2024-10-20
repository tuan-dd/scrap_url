#!/bin/bash
DIRECTORY="./*" # Define the directory pattern

cd node-common
sh build-package.sh
cd -
# Loop over each directory in the current directory
for d in $DIRECTORY; do
    if [ -d "$d" ]; then # Check if it's a directory
        if [[ "$(basename "$d")" == "node_modules" || "$(basename "$d")" == "node-common" || "$(basename "$d")" == "tlj-mock-service" || "$(basename "$d")" == "service-template" ]]; then
            continue
        fi

        echo "Processing directory: $d"
        cd "$d" # Change into the directory
        rm -rf node_modules
        # Check for the presence of the 'prisma' directory
        if [ -d "prisma" ]; then
            # echo "Prisma directory found in $d"

            # Run yarn commands only if the 'prisma' directory exists
            if yarn && yarn prisma generate && yarn build; then
                echo "Build successful in $d"
                # Remove the dist directory after successful build
                rm -rf build
            else
                echo "Build failed in $d"
            fi
        else
            # echo "No Prisma directory found in $d, skipping prisma generate"
            # Run yarn build if there's no 'prisma' directory
            if yarn && yarn build; then
                echo "Build successful in $d"
                # Remove the dist directory after successful build
                rm -rf build
            else
                echo "Build failed in $d"
            fi
        fi

        cd - # Go back to the original directory
    fi
done
