if [ -z "$1" ]; then
  echo "Usage: create.sh <module_name>"
  exit 1
fi

if [[ !("$1" =~ ^[a-zA-Z_]*$) ]]; then
    echo "El nombre del modulo tiene que tener la siguiente estructura 'module_name'"
    exit 1
fi

for folder in modules/*/; do
    folder_name=$(basename "$folder")
    if [[ "$folder_name" == "$1" ]]; then
        echo "A module with the name '$1' already exists!"
        exit 1
    fi
done

SOURCE_FOLDER="dev/base_module"
DESTINATION_FOLDER="modules/$1"

cp -r "$SOURCE_FOLDER" "$DESTINATION_FOLDER"

if [ -d "$DESTINATION_FOLDER" ]; then

    CONFIG_FILE="$DESTINATION_FOLDER/config/config.ts"

    if [ -f "$CONFIG_FILE" ]; then
        sed -i "s/^export const MODULE_NAME = 'base_module'*/export const MODULE_NAME = '$1';/" "$CONFIG_FILE"
    fi

    echo "Module $1 created!"
else
    echo "Error creating the module $1"
fi