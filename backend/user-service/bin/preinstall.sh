NODE_COMMON_DIRECTORY="$PWD"

PARENT_DIRECTORY=$(echo "$NODE_COMMON_DIRECTORY" | sed 's|\(/.*backend\).*|\1|')

if [ ! -d "$PARENT_DIRECTORY/node-common/dist" ]; then
echo "Publishing Node Common $PARENT_DIRECTORY"
    cd "$PARENT_DIRECTORY/node-common"
    yarn local:publish
fi
